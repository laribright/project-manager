import { getServerSession } from 'next-auth';
import OpenAi from 'openai';
import { NextResponse } from 'next/server';

import { authOptions } from '@/libs/auth';
import prisma from '@/libs/prisma';

const openai = new OpenAi({ apiKey: process.env.OPEN_API_KEY });

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(authOptions);

  const { prompt, role } = await req.json();

  if (!prompt || !role)
    return new NextResponse('Please provide a prompt', { status: 400 });

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role, content: prompt }],
    model: 'gpt-3.5-turbo',
  });

  const chatMessages = [
    { content: prompt, role },
    chatCompletion.choices[0].message,
  ];

  await Promise.all(
    chatMessages.map(async message => {
      const { role, content } = message;

      await prisma.aiChat.create({
        data: {
          role,
          content,
          userId: session?.user?.id as string,
        },
      });
    })
  );

  return NextResponse.json(chatCompletion, {
    status: 200,
    statusText: 'AI Result',
  });
}

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) return;

  const userId = session?.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { aiChat: true },
  });

  return NextResponse.json(user, {
    status: 200,
    statusText: 'Successful',
  });
}
