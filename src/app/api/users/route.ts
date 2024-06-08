import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { auth } from '@/auth';
import { HttpStatusCode } from 'axios';
import User, { IUser } from '@/models/IUser';

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);

  const page = parseInt(url?.searchParams?.get('page') || '0', 10) || 0;
  const limit = parseInt(url?.searchParams?.get('limit') || '0', 10) || 0;

  try {
    await dbConnect();

    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Authentication required' }, { status: HttpStatusCode.Unauthorized });
    }

    const [users, totalCount] = await Promise.all([User.find<IUser>(), User.countDocuments()]);

    if (!users) {
      return NextResponse.json({ message: 'Users not found' }, { status: HttpStatusCode.NotFound });
    }

    return NextResponse.json({
      users,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    // @ts-ignore
    return NextResponse.json({ error: error.message });
  }
};
