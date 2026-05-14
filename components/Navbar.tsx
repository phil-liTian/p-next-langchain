'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Bot, Search, FileText, GitBranch, Home } from 'lucide-react';

const navItems = [
  { href: '/', label: '聊天', icon: MessageSquare },
  { href: '/agents', label: 'Agent', icon: Bot },
  { href: '/retrieval', label: 'RAG', icon: Search },
  { href: '/structured_output', label: '结构化', icon: FileText },
  { href: '/langgraph', label: 'LangGraph', icon: GitBranch },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              {/* Next.js + LangChain */}
            </Link>
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}