import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen w-full bg-iza-50">
      <Navigation />
      <main className="flex-1 overflow-auto pb-24 md:pb-0">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
