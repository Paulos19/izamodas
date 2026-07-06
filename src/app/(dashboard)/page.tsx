import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-gray-500">Resumo financeiro diário - {format(new Date(), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldos Diário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {currentBalance.toFixed(2).replace('.', ',')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalIncome.toFixed(2).replace('.', ',')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalExpense.toFixed(2).replace('.', ',')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Troco (Adicionado)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              R$ {totalChange.toFixed(2).replace('.', ',')}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
