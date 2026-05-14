'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Zap, Target, CheckCircle } from 'lucide-react';

export function ProjectInfo() {
  const [isOpen, setIsOpen] = useState(false);

  const projectHighlights = [
    {
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      title: '现代化技术栈',
      description: '基于 Next.js 14+ App Router，结合 LangChain.js 和 DeepSeek 大语言模型，采用最新的 AI 开发实践'
    },
    {
      icon: <Zap className="w-5 h-5 text-blue-500" />,
      title: '流式响应支持',
      description: '实现真正的打字机效果，提供流畅的 AI 对话体验，支持实时响应输出'
    },
    {
      icon: <Target className="w-5 h-5 text-green-500" />,
      title: '完整功能覆盖',
      description: '包含基础聊天、Agent 智能体、RAG 检索增强、结构化输出等核心 AI 功能'
    }
  ];

  const problemsSolved = [
    '如何在 Next.js 项目中集成 LangChain 和 DeepSeek AI',
    '如何实现 AI 流式响应和打字机效果',
    '如何构建可复用的 Agent 系统和工具调用',
    '如何使用 RAG 技术实现基于自有文档的问答',
    '如何获取结构化的 AI 输出用于业务处理'
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100%-2rem)]">
      <div className={`bg-white rounded-lg shadow-lg border overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px]' : 'max-h-12'}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span>项目说明</span>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        
        {isOpen && (
          <div className="px-4 pb-4 max-h-[450px] overflow-y-auto">
            <div className="mt-3">
              <h3 className="text-base font-semibold text-gray-900 mb-3">项目亮点</h3>
              <div className="space-y-3">
                {projectHighlights.map((highlight, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">{highlight.icon}</div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{highlight.title}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{highlight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">本项目帮你解决</h3>
              <ul className="space-y-2">
                {problemsSolved.map((problem, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600">{problem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}