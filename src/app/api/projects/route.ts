import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/libs/auth';
import prisma from '@/libs/prisma';

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Not Authenticated', { status: 500 });
  }

  try {
    const projects = await prisma.project.findMany();

    return NextResponse.json(projects, {
      status: 200,
      statusText: 'Successful',
    });
  } catch (error) {
    console.log(error);
    return new NextResponse('Cannot fetch data', { status: 500 });
  }
}

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Not Authenticated', { status: 500 });
  }

  const userId = session.user?.id;

  const { description, name, slug } = await req.json();

  if (!description || !name || !slug) {
    return new NextResponse('Please all fields are required', { status: 400 });
  }

  try {
    const createdProject = await prisma.project.create({
      data: {
        description,
        name,
        slug,
        userId,
      },
    });

    return NextResponse.json(createdProject, {
      status: 200,
      statusText: 'Project Created',
    });
  } catch (error) {
    console.log(error);
    return new NextResponse('Creation Error', { status: 500 });
  }
}

export async function PATCH(req: Request, res: Response) {
  const { description, name, id, slug } = await req.json();

  if (!description || !name || !id || !slug) {
    return new NextResponse('Please all fields are required', { status: 400 });
  }

  try {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: { description, name, slug },
    });

    return NextResponse.json(updatedProject, {
      status: 200,
      statusText: 'Successful',
    });
  } catch (error) {
    console.log(error);
    return new NextResponse('Error Updating', { status: 500 });
  }
}
