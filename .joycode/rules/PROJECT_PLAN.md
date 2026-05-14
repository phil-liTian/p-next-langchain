# Next.js + LangChain + DeepSeek AI 应用项目规划

## 一、项目概述

基于 Next.js 框架，结合 LangChain 和 DeepSeek 大语言模型，构建一个现代化的 AI 应用。项目提供了丰富的 AI 功能示例，包括聊天、Agent、RAG、LangGraph 等。

## 二、技术栈

- **前端框架**: Next.js 14+ (App Router)
- **AI 框架**: LangChain.js + LangGraph
- **大语言模型**: DeepSeek (通过 @langchain/deepseek)
- **样式方案**: Tailwind CSS + shadcn/ui
- **状态管理**: React Hooks
- **部署平台**: Vercel (推荐)

## 三、目录结构

```
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── chat/                 # 聊天 API
│   │   ├── retrieval/            # RAG 检索 API
│   │   ├── retrieval_agents/     # 检索 Agent API
│   │   └── structured_output/    # 结构化输出 API
│   ├── agents/                   # Agent 示例
│   ├── ai_sdk/                   # AI SDK 示例
│   ├── langgraph/                # LangGraph 示例
│   ├── retrieval/                # Retrieval 示例
│   └── structured_output/        # 结构化输出示例
│
├── components/                   # React 组件
│   ├── ChatMessageBubble.tsx     # 聊天消息气泡
│   ├── ChatWindow.tsx            # 聊天窗口
│   ├── Navbar.tsx                # 导航栏
│   ├── ui/                       # UI 组件库
│   └── guide/                    # 指南组件
│
├── utils/                        # 工具函数
└── data/                         # 静态数据
```

## 四、核心功能

### 1. 基础功能
- [x] DeepSeek API 集成
- [x] 流式响应支持
- [x] 对话历史管理
- [x] 多轮对话能力

### 2. Agent 功能
- [x] 自定义 Agent 实现
- [x] Agent Tools 定义与调用
- [x] LangGraph Agent

### 3. RAG 功能
- [x] 文档检索增强
- [x] 向量存储集成
- [x] 检索 Agent

### 4. 高级功能
- [x] 结构化输出
- [x] 文档上传与解析

## 五、开发步骤（已完成）

### 第一阶段：基础搭建 ✅
1. 初始化 Next.js 项目
2. 安装依赖 (@langchain/deepseek, langchain)
3. 配置环境变量 (DEEPSEEK_API_KEY)
4. 验证 API 连接

### 第二阶段：核心功能 ✅
1. 创建 LangChain 客户端封装
2. 实现聊天 API 路由
3. 构建前端聊天界面
4. 添加流式响应处理

### 第三阶段：扩展功能 ✅
1. Agent 系统的实现
2. RAG 检索功能
3. LangGraph 集成
4. 结构化输出

## 六、环境变量

```env
DEEPSEEK_API_KEY=your_api_key_here
```

## 七、注意事项

1. API 密钥安全: 切勿将 API Key 提交到版本控制系统
2. 成本控制: 监控 API 调用次数和费用
3. 错误处理: 做好异常捕获和用户提示
4. 打字机效果: 使用流式输出提升用户体验

## 八、参考资料

- [LangChain.js 文档](https://js.langchain.com/)
- [DeepSeek API 文档](https://platform.deepseek.com/)
- [Next.js 文档](https://nextjs.org/docs)