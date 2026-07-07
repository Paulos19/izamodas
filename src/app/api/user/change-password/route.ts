import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    // In a real app, we should verify the JWT Bearer token here.
    // Assuming the mobile app sends `{ email, currentPassword, newPassword }` for now, 
    // or we decode the token to get the email.
    // For simplicity, we'll expect email in the body if we are not strictly checking the JWT in this route yet.
    
    // Better: let's expect the token or email. If the mobile app is sending email, we use it.
    const body = await req.json()
    const { email, currentPassword, newPassword } = body

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Preencha todos os campos.' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'A nova senha deve ter no mínimo 6 caracteres.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Usuário inválido.' }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'A senha atual está incorreta.' }, { status: 401 })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { email },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao trocar senha' }, { status: 500 })
  }
}
