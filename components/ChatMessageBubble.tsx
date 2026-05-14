import { cn } from '@/utils/cn';
import { useState, useEffect } from 'react';

interface ChatMessageBubbleProps {
  role: 'user' | 'assistant';
  content: string | Record<string, any>;
  isStreaming?: boolean;
}

// 打字机效果组件
function TypewriterEffect({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    // 当文本改变时重置打字机效果
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  return <>{displayText}</>;
}

// 判断是否为结构化数据（对象但不是字符串）
const isStructuredData = (content: string | Record<string, any>): boolean => {
  return typeof content === 'object' && content !== null && !Array.isArray(content);
};

export function ChatMessageBubble({ role, content, isStreaming }: ChatMessageBubbleProps) {
  const isUser = role === 'user';
  console.log('content', content)

  // 字符串直接展示
  if (typeof content === 'string') {
    return (
      <div
        className={cn(
          'flex w-full',
          isUser ? 'justify-end' : 'justify-start'
        )}
      >
        <div
          className={cn(
            'max-w-[80%] rounded-lg px-4 py-2',
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-900'
          )}
        >
          <div className="whitespace-pre-wrap">
            <TypewriterEffect text={content} />
          </div>
          {isStreaming && (
            <span className="inline-block animate-pulse ml-1">▊</span>
          )}
        </div>
      </div>
    );
  }

  // 结构化数据遍历展示
  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2',
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        )}
      >
        {isStructuredData(content) ? (
          <div className="space-y-3">
            {Object.entries(content).map(([key, value]) => (
              <div key={key}>
                <div className="font-semibold text-sm capitalize">{key}:</div>
                {Array.isArray(value) ? (
                  key === 'ingredients' || key === '原材料' ? (
                    <div className="text-sm ml-2 mt-1">
                      {value.map((item, index) => (
                        <span key={index}>
                          {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                          {index < value.length - 1 ? '、' : ''}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="list-disc list-inside ml-2 mt-1">
                      {value.map((item, index) => (
                        <div key={index} className="text-sm">
                          {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                        </div>
                      ))}
                    </div>
                  )
                ) : typeof value === 'object' && value !== null ? (
                  <pre className="text-xs mt-1 bg-gray-200/50 p-2 rounded">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                ) : (
                  <div className="text-sm ml-2">{String(value)}{ key === '时间'? '分钟' : '' }</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="font-mono text-sm whitespace-pre-wrap">
            {JSON.stringify(content, null, 2)}
          </div>
        )}
        {isStreaming && (
          <span className="inline-block animate-pulse ml-1">▊</span>
        )}
      </div>
    </div>
  );
}