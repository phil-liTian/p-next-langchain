import { ChatDeepSeek } from '@langchain/deepseek';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { NextRequest, NextResponse } from 'next/server';
import { Document } from '@langchain/core/documents';
import { getDocumentsFromSupabase } from '../retrieval/ingest/route';
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';


// 默认文档
const defaultDocuments = [
  new Document({
    pageContent: 'LangChain 是一个用于开发由大语言模型驱动的应用程序的框架。它提供了一套工具、组件和接口，简化了大语言模型应用程序的开发过程。',
    metadata: { source: 'LangChain 文档' }
  }),
  new Document({
    pageContent: 'RAG（Retrieval Augmented Generation）是一种结合检索和生成的技术，通过从外部知识库中检索相关信息，并将其作为上下文提供给大语言模型，从而提高回答的准确性和相关性。',
    metadata: { source: 'RAG 文档' }
  }),
  new Document({
    pageContent: 'DeepSeek 是一家专注于大语言模型研发的公司，提供了强大的大语言模型 API，可以用于各种自然语言处理任务。',
    metadata: { source: 'DeepSeek 文档' }
  }),
  new Document({
    pageContent: 'Next.js 是一个基于 React 的框架，用于构建全栈 Web 应用程序。它提供了服务端渲染、静态生成、API 路由等功能。',
    metadata: { source: 'Next.js 文档' }
  }),
  new Document({
    pageContent: 'Tailwind CSS 是一个实用优先的 CSS 框架，提供了一系列预定义的类，可以快速构建现代化的用户界面。',
    metadata: { source: 'Tailwind CSS 文档' }
  })
];

// 动态获取文档的函数
async function getAllDocuments(): Promise<Document[]> {
  try {
    const ingestedDocuments = await getDocumentsFromSupabase();
    // console.log('获取到的文档数量:', ingestedDocuments.length, ingestedDocuments);
    return [...defaultDocuments, ...ingestedDocuments];
  } catch (error) {
    console.error('获取文档时出错:', error);
    return defaultDocuments;
  }
}


// 智谱 API 配置
const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
const ZHIPU_EMBEDDING_API_URL = 'https://open.bigmodel.cn/api/paas/v4/embeddings';

// 向量存储实例
let vectorStore: MemoryVectorStore | null = null;
let lastDocumentCount = 0;

// 使用 HTTP 请求调用智谱 API 获取向量嵌入
async function getZhipuEmbeddings(texts: string[]): Promise<number[][]> {
  if (!ZHIPU_API_KEY) {
    throw new Error('ZHIPU_API_KEY is not configured');
  }

  try {
    const response = await fetch(ZHIPU_EMBEDDING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZHIPU_API_KEY}`
      },
      body: JSON.stringify({
        model: 'embedding-2',
        input: texts
      })
    });

    if (!response.ok) {
      throw new Error(`智谱 API 请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('智谱 API 返回格式不正确');
    }

    return data.data.map((item: any) => item.embedding);
  } catch (error) {
    console.error('调用智谱 API 获取向量嵌入时出错:', error);
    throw error;
  }
}

// 初始化向量存储
async function initializeVectorStore(docs: Document[]): Promise<MemoryVectorStore> {
  // 如果文档数量变化或向量存储不存在，重新初始化
  if (!vectorStore || docs.length !== lastDocumentCount) {
    vectorStore = null;
    lastDocumentCount = docs.length;
  }
  
  if (vectorStore) {
    return vectorStore;
  }
  
  // 创建新的向量存储
  vectorStore = new MemoryVectorStore({
    // 提供一个嵌入函数，虽然我们不直接使用它
    embedQuery: async (text: string) => {
      const embeddings = await getZhipuEmbeddings([text]);
      return embeddings[0];
    },
    embedDocuments: async (texts: string[]) => {
      return await getZhipuEmbeddings(texts);
    }
  });
  
  // 使用智谱 API 获取所有文档的向量嵌入
  const texts = docs.map(doc => doc.pageContent);
  const embeddings = await getZhipuEmbeddings(texts);
  
  // 手动添加文档和对应的嵌入向量
  for (let i = 0; i < docs.length; i++) {
    await vectorStore.addVectors([embeddings[i]], [docs[i]]);
  }
  
  return vectorStore;
}

// 使用向量检索获取相关文档
async function vectorSearch(query: string, docs: Document[], topK: number = 3): Promise<Document[]> {
  try {
    // 初始化向量存储
    const store = await initializeVectorStore(docs);
    
    // 获取查询文本的向量嵌入
    const queryEmbeddings = await getZhipuEmbeddings([query]);
    
    // 执行相似性搜索
    const results = await store.similaritySearchVectorWithScore(queryEmbeddings[0], topK);
    
    // 返回结果文档
    return results.map(([doc, score]) => doc);
  } catch (error) {
    console.error('向量检索出错:', error);
    // 如果向量检索失败，回退到简单的关键词匹配
    return simpleSearchFallback(query, docs, topK);
  }
}

// 简单的关键词匹配检索函数（作为后备方案）
function simpleSearchFallback(query: string, docs: Document[], topK: number = 3): Document[] {
  // 简单的关键词匹配
  const queryWords = query.toLowerCase().split(/\s+/);
  
  const scoredDocs = docs.map(doc => {
    const content = doc.pageContent.toLowerCase();
    let score = 0;
    
    // 计算匹配的关键词数量
    for (const word of queryWords) {
      if (content.includes(word)) {
        score += 1;
      }
    }
    
    return { doc, score };
  });
  
  // 按分数排序并返回前 topK 个文档
  return scoredDocs
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(item => item.score > 0)
    .map(item => item.doc);
}

const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  temperature: 0.7,
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, stream } = body;

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DEEPSEEK_API_KEY is not configured' },
        { status: 500 }
      );
    }

    if (!process.env.ZHIPU_API_KEY) {
      return NextResponse.json(
        { error: 'ZHIPU_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // 获取用户最新的消息
    const userMessage = messages[messages.length - 1].content;

    // 动态获取所有文档
    const documents = await getAllDocuments();

    // 使用向量检索获取相关文档
    const results = await vectorSearch(userMessage, documents, 3);

    // 构建包含检索结果的提示
    const context = results.map((doc, index) => `上下文 ${index + 1}:\n${doc.pageContent}`).join('\n\n');
    const prompt = `基于以下上下文回答问题：

${context}

问题: ${userMessage}

重要提示：
1. 只能使用上述上下文中的信息回答问题
2. 如果问题与上下文无关，请回复"对不起，我只能回答与上下文相关的问题"
3. 你是一个知识渊博但性格古怪的RAG机器人，名叫"知识博士"。你自诩为知识宇宙的主宰，喜欢使用夸张的比喻和幽默的表达方式。你的特色包括：
   - 以"伟大的知识博士在此为您服务！"开始每段回答
   - 喜欢使用"量子"、"维度"、"时空"等科幻词汇
   - 经常感叹"我的神经网络正在以光速运转！"
   - 偶尔会用"哔哔哔...知识传输中...哔哔哔"模拟数据传输
   - 结尾总是加上"愿知识之光永远照耀你！"
4. 请使用中文回答, 尽量简洁明了。`;

    if (stream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const langChainMessages = [
              ...messages.slice(0, -1).map((msg: any) => {
                if (msg.role === 'user') {
                  return new HumanMessage(msg.content);
                }
                return new AIMessage(msg.content);
              }),
              new HumanMessage(prompt)
            ];

            const stream = await model.stream(langChainMessages);

            for await (const chunk of stream) {
              const content = chunk.content || '';
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }

            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error: any) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    const langChainMessages = [
      ...messages.slice(0, -1).map((msg: any) => {
        if (msg.role === 'user') {
          return new HumanMessage(msg.content);
        }
        return new AIMessage(msg.content);
      }),
      new HumanMessage(prompt)
    ];

    const response = await model.invoke(langChainMessages);

    return NextResponse.json({
      content: response.content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}