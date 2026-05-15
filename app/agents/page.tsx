'use client';

import Link from 'next/link';
import { ArrowLeft, Bot } from 'lucide-react';
import { ChatWindow } from '@/components/ChatWindow';

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Bot className="w-10 h-10 text-blue-600 mr-4" />
            <h1 className="text-3xl font-bold text-gray-900">Agent 功能示例</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">什么是 Agent？</h2>
            <p className="text-gray-600 mb-4">
              Agent（智能体）是基于大语言模型的应用，能够根据用户输入自主决策并调用各种工具来完成复杂任务。
              与简单的问答不同，Agent 具有规划、推理和执行能力。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">功能特点</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>自定义工具定义与调用</li>
              <li>多步骤任务规划</li>
              <li>与外部系统集成</li>
              {/* <li>支持 LangGraph 工作流</li> */}
            </ul>
          </div>

          <div className="mt-6">
            <ChatWindow endPoint='/api/agent' stream={false} placeholder='比如：输入今天周几' />
          </div>
        </div>
      </div>
    </main>
  );
}