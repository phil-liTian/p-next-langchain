import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from '@langchain/core/documents';
import { supabaseAdmin, DOCUMENTS_TABLE } from '../../../../utils/supabase';
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
const pdfjsWorker = require('pdfjs-dist/legacy/build/pdf.worker.entry');

// 绑定 worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * 解析 PDF 二进制 Buffer
 * @param pdfBuffer PDF 二进制数据
 * @returns 解析后的文本
 */
async function parsePdfBuffer(pdfBuffer: Buffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer)
    });
    const pdfDoc = await loadingTask.promise;

    let fullText = '';
    const numPages = pdfDoc.numPages;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText.trim();
  } catch (error: any) {
    throw new Error(`PDF 解析失败：${error.message}`);
  }
}

export const runtime = "nodejs";

/**
 * 处理上传的文本或 PDF 文件
 */
export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_DEMO === "true") {
    return NextResponse.json(
      { error: "Ingest is not supported in demo mode." },
      { status: 403 }
    );
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let textToProcess: string;
    let source: string = '用户上传';

    if (contentType.includes('multipart/form-data')) {
      // 处理 PDF 文件上传
      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json(
          { error: '未找到上传的文件' },
          { status: 400 }
        );
      }

      if (file.type !== 'application/pdf') {
        return NextResponse.json(
          { error: '只支持 PDF 文件' },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      
      try {
        textToProcess = await parsePdfBuffer(buffer);
        source = file.name || '上传的 PDF 文件';
      } catch (parseError) {
        console.error('PDF 解析错误:', parseError);
        return NextResponse.json(
          { error: 'PDF 文件解析失败，请确保文件格式正确' },
          { status: 400 }
        );
      }
    } else {
      // 处理文本输入
      const body = await req.json();
      const text = body.text;

      if (!text || text.trim() === '') {
        return NextResponse.json(
          { error: '文本内容不能为空' },
          { status: 400 }
        );
      }

      textToProcess = text;
    }

    // 文本分割
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 256,
      chunkOverlap: 20,
    });

    const splitDocuments = await splitter.createDocuments([textToProcess]);

    // 存储到 Supabase
    const documentsToInsert = splitDocuments.map(doc => ({
      content: doc.pageContent,
      metadata: { ...doc.metadata, source },
      created_at: new Date().toISOString()
    }));

    const { error } = await supabaseAdmin
      .from(DOCUMENTS_TABLE)
      .insert(documentsToInsert)
      .select();

    if (error) {
      throw new Error(`Supabase insert error: ${error.message}`);
    }

    return NextResponse.json({
      ok: true,
      message: `成功添加 ${splitDocuments.length} 个文档片段`,
      totalDocuments: splitDocuments.length,
      source
    }, { status: 200 });
  } catch (e: any) {
    console.error('处理上传时出错:', e);
    
    let errorMessage = '处理上传时发生错误';
    if (e.message) {
      errorMessage = e.message;
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * 从 Supabase 获取所有文档
 */
export async function getDocumentsFromSupabase(): Promise<Document[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from(DOCUMENTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Supabase fetch error: ${error.message}`);
    }

    return (data || []).map((item: any) =>
      new Document({
        pageContent: item.content,
        metadata: item.metadata
      })
    );
  } catch (error) {
    console.error('Error fetching documents from Supabase:', error);
    return [];
  }
}