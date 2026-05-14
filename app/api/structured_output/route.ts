import { ChatDeepSeek } from '@langchain/deepseek';
import { HumanMessage } from '@langchain/core/messages';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  temperature: 0.7,
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// 定义一个示例 schema
const recipeSchema = z.object({
  菜名: z.string().describe("食谱名称"),
  原材料: z.array(z.string()).describe("食材列表"),
  步骤: z.array(z.string()).describe("烹饪步骤"),
  时间: z.number().describe("烹饪时间（分钟）"),
});

const structuredModel = model.withStructuredOutput(recipeSchema);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DEEPSEEK_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const userMessage = messages?.[messages.length - 1]?.content || '';

    if (!userMessage) {
      return NextResponse.json(
        { error: 'No message content provided' },
        { status: 400 }
      );
    }

    const response = await structuredModel.invoke([
      new HumanMessage(`请根据以下要求生成一个食谱：${userMessage}`)
    ]);

    return NextResponse.json({
      content: response,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}