'use client';

import { useState, FormEvent } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface UploadDocumentsFormProps {
  onUploadSuccess?: () => void;
}

export function UploadDocumentsForm({ onUploadSuccess }: UploadDocumentsFormProps) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let response;

      if (file) {
        // 处理文件上传
        const formData = new FormData();
        formData.append('file', file);

        response = await fetch('/api/retrieval/ingest', {
          method: 'POST',
          body: formData,
        });
      } else {
        // 处理文本上传
        response = await fetch('/api/retrieval/ingest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '上传失败');
      }

      const data = await response.json();
      setSuccess(true);
      setText('');
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Upload className="w-5 h-5 mr-2" />
        上传文档
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="document-text" className="block text-sm font-medium text-gray-700 mb-2">
            文档内容
          </label>
          <textarea
            id="document-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="请输入要上传的文档内容..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={!!file}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="document-file" className="block text-sm font-medium text-gray-700 mb-2">
            或上传 PDF 文件
          </label>
          <input
            id="document-file"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={!!text.trim()}
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              已选择文件: {file.name}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
            <FileText className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-sm text-green-700">文档上传成功！现在您可以在检索中使用这些内容。</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || (!text.trim() && !file)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '上传中...' : '上传文档'}
          </button>
        </div>
      </form>
    </div>
  );
}