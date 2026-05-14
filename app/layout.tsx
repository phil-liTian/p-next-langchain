import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { ProjectInfo } from '@/components/ProjectInfo';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js + LangChain + DeepSeek AI 应用',
  description: '基于 Next.js、LangChain 和 DeepSeek 的 AI 应用示例',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <ProjectInfo />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}