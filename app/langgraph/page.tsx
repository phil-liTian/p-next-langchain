import Link from 'next/link';
import { ArrowLeft, GitBranch } from 'lucide-react';

export default function LangGraphPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:underline mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" /> 返回首页
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <GitBranch className="w-10 h-10 text-blue-600 mr-4" />
            <h1 className="text-3xl font-bold text-gray-900">LangGraph 示例</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">什么是 LangGraph？</h2>
            <p className="text-gray-600 mb-4">
              LangGraph 是 LangChain 推出的用于构建有状态、多步骤 AI 应用的框架。
              它使用图结构来定义复杂的工作流，支持循环、条件分支和持久化状态。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">功能特点</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>基于图的工作流定义</li>
              <li>支持循环和条件逻辑</li>
              <li>持久化状态管理</li>
              <li>多 Agent 协作</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}