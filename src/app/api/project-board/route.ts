import prisma from '@/libs/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  const { status, projectId, slug } = await req.json();

  if (!status || !projectId || !slug)
    return new NextResponse('Please all fields are required', { status: 400 });

  try {
    const maxOrderResult = await prisma.projectBoard.aggregate({
      _max: {
        order: true,
      },
      where: {
        projectId,
      },
    });

    const nextOrder = maxOrderResult._max?.order
      ? maxOrderResult._max.order + 1
      : 1;

    const createdProjectBoard = await prisma.projectBoard.create({
      data: {
        slug,
        status,
        project: {
          connect: { id: projectId },
        },
        order: nextOrder,
      },
    });

    return NextResponse.json(createdProjectBoard, {
      status: 200,
      statusText: 'Project board created',
    });
  } catch (error) {
    console.log(error);
    return new NextResponse('Creation Error', { status: 500 });
  }
}

export async function PATCH(req: Request, res: Response) {
  const {
    projectId,
    sourceIndex,
    destinationIndex,
    type,
    sourceBoardId,
    destinationBoardId,
  } = await req.json();

  try {
    if (type === 'status') {
      const projectBoards = await prisma.projectBoard.findMany({
        where: { projectId },
        orderBy: { order: 'asc' },
      });

      const sourceBoard = projectBoards[sourceIndex];
      const destinationBoard = projectBoards[destinationIndex];

      await prisma.projectBoard.update({
        where: {
          id: sourceBoard.id,
        },
        data: {
          order: destinationBoard.order,
        },
      });

      await prisma.projectBoard.update({
        where: {
          id: destinationBoard.id,
        },
        data: {
          order: sourceBoard.order,
        },
      });

      return NextResponse.json('Update successful', {
        status: 200,
        statusText: 'Successful',
      });
    }

    if (type === 'feature') {
      const project = await prisma.project.findUnique({
        where: {
          id: projectId,
        },
        include: { projectBoards: { include: { features: true } } },
      });

      if (!project)
        return new NextResponse('project not found', { status: 500 });

      const sourceBoard = project.projectBoards.find(
        board => board.id === sourceBoardId
      );
      const destinationBoard = project.projectBoards.find(
        board => board.id === destinationBoardId
      );

      if (!sourceBoard || !destinationBoard)
        return new NextResponse('Error Updating', { status: 500 });

      const movedFeature = sourceBoard.features[sourceIndex];

      if (sourceBoardId === destinationBoardId) {
        const sourceFeatures = [...sourceBoard.features];
        const movedFeature = sourceFeatures.splice(sourceIndex, 1)[0];

        const destinationOrder =
          sourceFeatures[destinationIndex].order || destinationIndex + 1;

        movedFeature.order = destinationOrder;

        sourceFeatures.forEach((feature, index) => {
          if (
            index >= Math.min(sourceIndex, destinationIndex) &&
            index <= Math.max(sourceIndex, destinationIndex)
          ) {
            feature.order = index + 1;
          }
        });

        await prisma.projectBoard.update({
          where: { id: sourceBoardId },
          data: { order: destinationOrder },
        });

        await prisma.feature.update({
          where: { id: movedFeature.id },
          data: { order: destinationOrder },
        });
      } else {
        destinationBoard.features.splice(destinationIndex, 0, movedFeature);

        await prisma.projectBoard.update({
          where: { id: destinationBoardId },
          data: { features: { set: destinationBoard.features } },
        });

        sourceBoard.features.splice(sourceIndex, 1);

        await prisma.projectBoard.update({
          where: { id: sourceBoardId },
          data: { features: { set: sourceBoard.features } },
        });

        return NextResponse.json('Update successful', {
          status: 200,
          statusText: 'Successful',
        });
      }
    }
  } catch (error) {
    console.log(error);
    return new NextResponse('Error Updating', { status: 500 });
  }
}
