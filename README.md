# Next.js + LangChain + DeepSeek AI 应用

基于 Next.js 框架，结合 LangChain.js 和 DeepSeek 大语言模型构建的现代化 AI 应用示例项目。

## 功能特性

- **基础聊天**: 支持流式响应的多轮对话
- **Agent 系统**: 自定义工具调用的智能 Agent
- **RAG 检索**: 文档检索增强生成
- **检索 Agent**: 结合检索和工具调用的智能Agent
- **LangGraph**: 基于 LangGraph 的工作流编排
- **结构化输出**: JSON 格式的结构化输出

## 技术栈

- **框架**: Next.js 14+ (App Router)
- **AI 框架**: LangChain.js + LangGraph
- **大语言模型**: DeepSeek (@langchain/deepseek)
- **样式**: Tailwind CSS + shadcn/ui
- **向量存储**: Supabase

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd p-next-langchain
```

### 2. 安装依赖
```bash
pnpm install
# 或者
yarn install
# 或者
npm install
```

### 3. 配置环境变量
复制 `.env.example` 为 `.env.local` 并填写你的 API 密钥:
```bash
cp .env.example .env.local
```

编辑 `.env.local`:
```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
# 可选: Supabase 配置（用于 RAG）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 启动开发服务器
```bash
pnpm dev
# 或者
yarn dev
# 或者
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── chat/                 # 聊天 API
│   │   ├── retrieval/            # RAG 检索 API
│   │   ├── retrieval_agents/     # 检索 Agent API
│   │   └── structured_output/    # 结构化输出 API
│   ├── agents/                   # Agent 示例页面
│   ├── langgraph/                # LangGraph 示例页面
│   ├── retrieval/                # Retrieval 示例页面
│   ├── retrieval_agents/         # Retrieval Agents 示例页面
│   ├── structured_output/        # 结构化输出示例页面
│   └── page.tsx                  # 首页
├── components/                   # React 组件
│   ├── ui/                       # shadcn/ui 组件
│   ├── ChatMessageBubble.tsx     # 消息气泡
│   ├── ChatWindow.tsx            # 聊天窗口
│   ├── Navbar.tsx                # 导航栏
│   └── UploadDocumentsForm.tsx   # 文档上传表单
├── utils/                        # 工具函数
└── data/                         # 静态数据
```

## 功能演示

### 基础聊天
访问首页，开始与 DeepSeek AI 进行对话，支持流式响应。

### Agent
访问 `/agents` 页面，体验带有工具调用的智能 Agent。

### RAG 检索
访问 `/retrieval` 页面，上传文档并基于文档内容进行问答。

### 结构化输出
访问 `/structured_output` 页面，体验 JSON 格式的结构化输出。

### LangGraph
访问 `/langgraph` 页面，体验基于 LangGraph 的工作流。

## 环境变量说明

| 变量 | 说明 | 必需 |
|------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ❌（RAG 需要） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ❌（RAG 需要） |

## 获取 DeepSeek API 密钥

1. 访问 [DeepSeek 平台](https://platform.deepseek.com/)
2. 注册/登录账号
3. 进入 API 密钥管理页面
4. 创建新的 API 密钥
5. 将密钥填入 `.env.local`

## 部署

### 方式一：Vercel（推荐）
1. 将代码推送到 GitHub/GitLab
2. 在 Vercel 导入项目
3. 配置环境变量
4. 一键部署

### 方式二：京东云服务器部署

#### 1. 构建项目
在本地构建生产版本：
```bash
pnpm build
# 或者
npm run build
```

#### 2. 上传到服务器
将 `.next` 文件夹、`package.json`、`next.config.js`、`.env.local` 上传到服务器：

```bash
# 在本地执行
scp -r .next package.json next.config.js .env.local root@your-server-ip:/path/to/your/app
```

#### 3. 在服务器上安装依赖并启动
```bash
# 登录服务器
ssh root@your-server-ip

# 进入项目目录
cd /path/to/your/app

# 安装生产依赖
pnpm install --production

# 使用 PM2 启动（推荐）
pm2 start npm --name "next-langchain" -- start

# 配置 Nginx 反向代理
# 参考：https://nextjs.org/docs/app/building-your-application/deploying/custom-server#nginx-configuration
```

#### 4. Nginx 配置示例
```nginx
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

## 注意事项

- **API 密钥安全**: 切勿将 API 密钥提交到版本控制系统
- **成本控制**: 注意监控 API 调用次数和费用
- **错误处理**: 生产环境请完善错误处理逻辑

## 参考资料

- [LangChain.js 文档](https://js.langchain.com/)
- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## 许可证

MIT