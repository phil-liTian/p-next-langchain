'use client';

import { ChatWindow } from '@/components/ChatWindow';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 pb-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">AI 聊天助手</h1>
        <ChatWindow endPoint='/api/chat' />
      </div>
    </div>
  );
}