import { Card, CardContent } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Bell, ArrowUpRight, ArrowDownRight, Minus, User } from 'lucide-react'

export default async function DashboardPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Calculate daily balance
  const txs = await prisma.financialTransaction.findMany({
    where: {
      date: {
        gte: today
      }
    }
  })

  let totalIncome = 0;
  let totalExpense = 0;
  let totalChange = 0;

  txs.forEach(tx => {
    if (tx.type === 'INCOME') totalIncome += tx.amount;
    if (tx.type === 'EXPENSE') totalExpense += tx.amount;
    if (tx.type === 'CHANGE') totalChange += tx.amount;
  });

  const currentBalance = totalIncome + totalChange - totalExpense;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Mobile-Like */}
      <div className="flex flex-row justify-between items-center mt-2 mb-8">
        <div className="flex flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-iza-100 border-[3px] border-white shadow-sm flex items-center justify-center overflow-hidden">
            <User size={28} className="text-iza-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Olá, Iza</h2>
            <p className="text-sm text-iza-700 font-medium">{format(new Date(), "dd 'de' MMMM", { locale: ptBR })}</p>
          </div>
        </div>
        
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shadow-iza-200/50 relative cursor-pointer hover:bg-iza-50 transition-colors">
          <Bell size={22} className="text-iza-500" />
          <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-iza-400 to-iza-600 rounded-3xl p-8 text-white shadow-lg shadow-iza-500/30 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-iza-800/20 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <p className="text-white/80 font-medium text-lg mb-2">Saldo em Caixa (Hoje)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold opacity-90">R$</span>
            <span className="text-5xl font-bold tracking-tight">{currentBalance.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        <Card className="rounded-2xl border-none shadow-sm shadow-iza-100 bg-white overflow-hidden group hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ArrowUpRight size={20} className="text-green-600" />
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Entradas</p>
            <p className="text-lg md:text-xl font-bold text-gray-800">R$ {totalIncome.toFixed(2).replace('.', ',')}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm shadow-iza-100 bg-white overflow-hidden group hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ArrowDownRight size={20} className="text-red-600" />
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Saídas</p>
            <p className="text-lg md:text-xl font-bold text-gray-800">R$ {totalExpense.toFixed(2).replace('.', ',')}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm shadow-iza-100 bg-white overflow-hidden group hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Minus size={20} className="text-gray-500" />
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Troco</p>
            <p className="text-lg md:text-xl font-bold text-gray-800">R$ {totalChange.toFixed(2).replace('.', ',')}</p>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
