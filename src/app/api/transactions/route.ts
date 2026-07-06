import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-utils'

export async function GET(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');

  let whereClause = {};
  if (startDate && endDate) {
    whereClause = {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }
  }

  const transactions = await prisma.financialTransaction.findMany({
    where: whereClause,
    orderBy: { date: 'desc' }
  });
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const { type, amount, description, date } = data;
    
    if (!type || amount === undefined || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTx = await prisma.financialTransaction.create({
      data: {
        type,
        amount: parseFloat(amount),
        description,
        date: date ? new Date(date) : new Date()
      }
    });

    return NextResponse.json(newTx, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
