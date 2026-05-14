import { ChatDeepSeek } from '@langchain/deepseek';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { NextRequest, NextResponse } from 'next/server';

const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  temperature: 0.7,
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, stream } = body;

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DEEPSEEK_API_KEY is not configured' },
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

            const systemMessage = new HumanMessage(
              '你是一个基于 LangGraph 的智能助手。LangGraph 允许你构建复杂的有状态工作流。' +
              '请详细回答用户的问题，并解释 LangGraph 如何帮助构建这个工作流。\n\n' +
              '用户问题：' + (langChainMessages[langChainMessages.length - 1].content as string)
            );
            
            langChainMessages[langChainMessages.length - 1] = systemMessage;

            const stream = await model.stream(langChainMessages);

            for await (const chunk of stream) {
              const content = chunk.content || '';
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
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

    const langChainMessages = messages.map((msg: any) => {
      if (msg.role === 'user') {
        return new HumanMessage(msg.content);
      }
      return new AIMessage(msg.content);
    });

    const response = await model.invoke(langChainMessages);

    return NextResponse.json({
      content: response.content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}