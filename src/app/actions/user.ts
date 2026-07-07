'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function changePassword(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.email) {
    return { error: 'Usuário não autenticado.' }
  }

  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Preencha todos os campos.' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'A nova senha e a confirmação não conferem.' }
  }

  if (newPassword.length < 6) {
    return { error: 'A nova senha deve ter no mínimo 6 caracteres.' }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user || !user.password) {
    return { error: 'Usuário inválido.' }
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.password)
  
  if (!isValidPassword) {
    return { error: 'A senha atual está incorreta.' }
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { email: session.user.email },
    data: { password: hashedNewPassword }
  })

  return { success: true }
}
