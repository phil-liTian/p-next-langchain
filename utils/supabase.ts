import { createClient } from '@supabase/supabase-js'

// 从环境变量获取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
console.log('supabaseAnonKey', supabaseAnonKey, supabaseServiceKey);

// 创建 Supabase 客户端
// 对于客户端使用匿名密钥

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 对于服务器端操作使用服务密钥（具有更高权限）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// 文档表名
export const DOCUMENTS_TABLE = 'documents'