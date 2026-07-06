import { auth } from '@/auth'
import jwt from 'jsonwebtoken'

export async function getAuthenticatedUser(req: Request) {
  // Try NextAuth session first (web)
  const session = await auth();
  if (session?.user) {
    return session.user;
  }

  // Try Bearer token (mobile)
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback_secret');
      return decoded;
    } catch (error) {
      return null;
    }
  }

  return null;
}
