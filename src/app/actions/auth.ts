'use server'

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirectTo: '/'
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: '/login' })
}
