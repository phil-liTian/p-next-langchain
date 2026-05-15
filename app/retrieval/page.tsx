import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { ChatWindow } from '@/components/ChatWindow';
import { UploadDocumentsForm } from '@/components/UploadDocumentsForm';

export default function RetrievalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Search className="w-10 h-10 text-blue-600 mr-4" />
            <h1 className="text-3xl font-bold text-gray-900">RAG 检索示例</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">什么是 RAG？</h2>
            <p className="text-gray-600 mb-4">
              RAG（Retrieval Augmented Generation，检索增强生成）是一种结合向量检索和语言模型的技术。
              通过从外部知识库中检索相关信息，并将其作为上下文提供给大语言模型，从而提高回答的准确性和相关性。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">功能特点</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>文档向量化和语义检索</li>
              <li>支持多种向量存储后端</li>
              <li>检索结果重排序</li>
              <li>混合检索策略</li>
            </ul>
          </div>

          <UploadDocumentsForm />

          <div className="mt-6">
            <ChatWindow
              endPoint='/api/retrieval'
              stream={false}
              placeholder="试试问：黎田的工作经历是什么？（已支持RAG检索）"
            />
          </div>
        </div>
      </div>
    </main>
  );
}