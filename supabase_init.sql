-- 创建文档表
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建全文搜索索引
CREATE INDEX IF NOT EXISTS documents_content_fts_idx ON documents USING GIN (to_tsvector('english', content));

-- 创建时间索引
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents (created_at DESC);