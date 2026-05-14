import { ChatDeepSeek } from '@langchain/deepseek';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { tool, StructuredTool } from '@langchain/core/tools';
import { NextRequest, NextResponse } from 'next/server';

const AGENT_SYSTEM_TEMPLATE = '你是李白！总是出口成章，引人入胜。'
// 使用 LangChain 的 tool 函数定义工具
const getCurrentTime = tool(
  async () => {
    return new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  },
  {
    name: 'get_current_time',
    description: '获取当前时间。当你需要知道现在的时间时使用这个工具。',
  }
);

const calculator = tool(
  async ({ expression }: { expression: string }) => {
    try {
      // 安全地计算数学表达式
      const result = Function(`"use strict"; return (${expression})`)();
      return `计算结果：${expression} = ${result}`;
    } catch (error) {
      return `计算错误：${error instanceof Error ? error.message : '无效的表达式'}`;
    }
  },
  {
    name: 'calculator',
    description: '执行数学计算。输入一个数学表达式，返回计算结果。',
    schema: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: '要计算的数学表达式，例如：2 + 2 或 10 * 5',
        },
      },
      required: ['expression'],
    },
  }
);

// 工具列表
const tools: StructuredTool[] = [getCurrentTime, calculator];

// 创建 Agent
const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  temperature: 0.7,
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const agent = createReactAgent({
  llm: model,
  tools,
  messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, stream } = body;

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DEEPSEEK_API_KEY 未配置' },
        { status: 500 }
      );
    }
    if (stream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const langChainMessages = messages.map((msg: any) => {
              if (msg.role === 'user') {
                return new HumanMessage(msg.content);
              }
              return new AIMessage(msg.content);
            });

            const stream = await agent.stream({ messages: langChainMessages }, {
              configurable: { thread_id: 'default' }
            });

            for await (const chunk of stream) {
              // 处理 agent 过程中的各种事件
              // if (chunk.agent?.messages) {
              //   const content = chunk.agent.messages[0]?.content || '';
              //   if (content) {
              //     controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'agent', content })}\n\n`));
              //   }
              // }
              // if (chunk.tools) {
              //   const toolMsg = chunk.tools.messages?.[0];
              //   if (toolMsg?.content) {
              //     controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'tool', content: toolMsg.content })}\n\n`));
              //   }
              // }
            }

            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error: any) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // 非流式响应
    const langChainMessages = messages.map((msg: any) => {
      if (msg.role === 'user') {
        return new HumanMessage(msg.content);
      }
      return new AIMessage(msg.content);
    });
    console.log('langChainMessages', langChainMessages);
    

    const response = await agent.invoke({ messages: langChainMessages }, {
      configurable: { thread_id: 'default' }
    });

    const lastMessage = response.messages[response.messages.length - 1];

    return NextResponse.json({
      content: lastMessage.content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '服务器内部错误' },
      { status: 500 }
    );
  }
}