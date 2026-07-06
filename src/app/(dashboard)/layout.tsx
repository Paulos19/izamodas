import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Tag, LogOut, ArrowRightLeft } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50/50">
      <aside className="w-64 border-r bg-white flex flex-col">
        <div className="h-16 flex items-center border-b px-6">
          <h1 className="text-xl font-bold">Izamodas</h1>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/roupas" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <Tag size={20} />
            Roupas
          </Link>
          <Link href="/financeiro" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <ArrowRightLeft size={20} />
            Financeiro
          </Link>
        </nav>
        <div className="p-4 border-t">
          <form action={logout}>
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" type="submit">
              <LogOut size={20} className="mr-3" />
              Sair
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
