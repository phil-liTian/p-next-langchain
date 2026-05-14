'use client';

import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { ChatWindow } from '@/components/ChatWindow';

export default function StructuredOutputPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <FileText className="w-10 h-10 text-blue-600 mr-4" />
            <h1 className="text-3xl font-bold text-gray-900">结构化输出示例</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">什么是结构化输出？</h2>
            <p className="text-gray-600 mb-4">
              结构化输出是指让大语言模型按照预定义的格式（如 JSON、Zod schema）返回内容。
              这对于需要程序化处理模型输出、构建 API 或数据管道等场景非常有用。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">功能特点</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>支持 JSON 和 Zod Schema 输出</li>
              <li>类型安全的输出处理</li>
              <li>自动验证和重试机制</li>
              <li>与 LangChain 集成</li>
            </ul>
          </div>

          <div className="mt-6">
            <ChatWindow endPoint='/api/structured_output' />
          </div>
        </div>
      </div>
    </main>
  );
}