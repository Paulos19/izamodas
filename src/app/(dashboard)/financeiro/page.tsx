import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ExportButtons } from '@/components/ExportButtons'
import { format } from 'date-fns'
import { TransactionForm } from '@/components/TransactionForm'

async function addTransaction(formData: FormData) {
  'use server'
  const type = formData.get('type') as 'INCOME' | 'EXPENSE' | 'CHANGE'
  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)
  const clothingItemId = formData.get('clothingItemId') as string | null

  if (type && description && !isNaN(amount)) {
    await prisma.financialTransaction.create({
      data: { 
        type, 
        description, 
        amount,
        clothingItemId: clothingItemId && clothingItemId !== 'none' ? clothingItemId : null
      }
    })
    revalidatePath('/financeiro')
    revalidatePath('/')
  }
}

export default async function FinanceiroPage() {
  const transactions = await prisma.financialTransaction.findMany({
    orderBy: { date: 'desc' },
    include: {
      clothingItem: true
    }
  })

  const clothingItems = await prisma.clothingItem.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, price: true }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
        <ExportButtons transactions={transactions} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <TransactionForm clothingItems={clothingItems} onSubmit={addTransaction} />

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">Nenhuma transação registrada.</TableCell>
                  </TableRow>
                ) : (
                  transactions.map(tx => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-gray-500 whitespace-nowrap">
                        {format(new Date(tx.date), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {tx.description}
                        {tx.clothingItem && <span className="ml-2 text-xs text-blue-500 font-semibold">(Peça Associada)</span>}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          tx.type === 'INCOME' ? 'bg-green-100 text-green-700' :
                          tx.type === 'EXPENSE' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {tx.type === 'INCOME' ? 'Entrada' : tx.type === 'EXPENSE' ? 'Gasto' : 'Troco'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        R$ {tx.amount.toFixed(2).replace('.', ',')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
