import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-utils'

export async function GET(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const clothing = await prisma.clothingItem.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(clothing);
}

export async function POST(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const { name, description, price } = data;
    
    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newItem = await prisma.clothingItem.create({
      data: {
        name,
        description,
        price: parseFloat(price)
      }
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
