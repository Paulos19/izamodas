import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-utils'

export async function GET(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');
  const page = url.searchParams.get('page');
  const limit = url.searchParams.get('limit');
  const typeParam = url.searchParams.get('type');

  let whereClause: any = {};
  if (startDate && endDate) {
    whereClause = {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }
  }

  if (typeParam) {
    whereClause.type = typeParam;
  }

  let queryOptions: any = {
    where: whereClause,
    orderBy: { date: 'desc' }
  };

  if (page && limit) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    queryOptions.skip = (pageNum - 1) * limitNum;
    queryOptions.take = limitNum;
  }

  const transactions = await prisma.financialTransaction.findMany(queryOptions);
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const { type, amount, description, date, paymentMethod, clothingItemId } = data;
    
    if (!type || amount === undefined || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const dataObj: any = {
      type,
      amount: parseFloat(amount),
      description,
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || undefined,
    };

    if (clothingItemId && clothingItemId !== 'none') {
      dataObj.clothingItem = { connect: { id: clothingItemId } };
    }

    const newTx = await prisma.financialTransaction.create({
      data: dataObj
    });

    return NextResponse.json(newTx, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
