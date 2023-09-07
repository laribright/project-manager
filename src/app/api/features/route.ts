import { parseISO } from 'date-fns';
import { NextResponse } from 'next/server';

import prisma from '@/libs/prisma';

export async function POST(req: Request, res: Response) {
  const { name, description, finishDate, projectBoardId, slug } =
    await req.json();

  if (!name || !description || !finishDate || !slug || !projectBoardId)
    return new NextResponse('Please provide all fields', { status: 400 });

  try {
    const projectBoard = await prisma.projectBoard.findUnique({
      where: { id: projectBoardId },
      include: {
        features: true,
      },
    });

    if (!projectBoard)
      return new NextResponse('Feature must belong to a project board', {
        status: 400,
      });

    const order = projectBoard.features.length + 1;

    const feature = await prisma.feature.create({
      data: {
        description,
        finishDate: parseISO(finishDate),
        name,
        order,
        slug,
        projectBoard: {
          connect: { id: projectBoardId },
        },
      },
    });

    return NextResponse.json(feature, {
      status: 200,
      statusText: 'Feature Created',
    });
  } catch (error) {
    console.log(error);
    return new NextResponse('Creation Error', { status: 500 });
  }
}
