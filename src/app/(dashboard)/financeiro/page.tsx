import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ExportButtons } from '@/components/ExportButtons'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TransactionForm } from '@/components/TransactionForm'
import { ArrowDownRight, ArrowUpRight, Minus, Search } from 'lucide-react'

async function addTransaction(formData: FormData) {
  'use server'
  const type = formData.get('type') as 'INCOME' | 'EXPENSE' | 'CHANGE'
  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)
  const clothingItemId = formData.get('clothingItemId') as string | null
  const paymentMethod = formData.get('paymentMethod') as 'CASH' | 'CARD' | null

  if (type && description && !isNaN(amount)) {
    const dataObj: any = {
      type, 
      description, 
      amount,
      paymentMethod: type === 'INCOME' && paymentMethod ? paymentMethod : undefined
    };

    if (clothingItemId && clothingItemId !== 'none') {
      dataObj.clothingItem = { connect: { id: clothingItemId } };
    }

    await prisma.financialTransaction.create({
      data: dataObj
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
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mt-2 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Financeiro</h2>
          <p className="text-sm text-gray-500">Acompanhe seu fluxo de caixa</p>
        </div>
        <ExportButtons transactions={transactions} />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <TransactionForm clothingItems={clothingItems} onSubmit={addTransaction} />

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm border border-iza-50">
            <span className="text-sm font-medium text-gray-500">Histórico Completo</span>
            <div className="p-2 bg-gray-50 rounded-full">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>

          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-iza-50 shadow-sm flex flex-col items-center">
                <div className="w-20 h-20 bg-iza-50 rounded-full flex items-center justify-center mb-4">
                  <ArrowUpRight size={32} className="text-iza-300" />
                </div>
                <h4 className="text-lg font-bold text-gray-700">Nenhuma transação</h4>
                <p className="text-gray-500 mt-2">Você ainda não registrou entradas ou saídas.</p>
              </div>
            ) : (
              transactions.map(tx => (
                <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-iza-50 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === 'INCOME' ? 'bg-green-50' : 
                    tx.type === 'EXPENSE' ? 'bg-red-50' : 'bg-gray-50'
                  }`}>
                    {tx.type === 'INCOME' ? <ArrowUpRight size={20} className="text-green-600" /> : 
                     tx.type === 'EXPENSE' ? <ArrowDownRight size={20} className="text-red-600" /> : 
                     <Minus size={20} className="text-gray-500" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">{tx.description}</p>
                    <p className="text-xs text-gray-500 font-medium">
                      {format(new Date(tx.date), "dd/MM 'às' HH:mm", { locale: ptBR })}
                      {tx.paymentMethod && <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-md">{tx.paymentMethod === 'CASH' ? 'Dinheiro/Pix' : 'Cartão'}</span>}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className={`font-bold text-base ${
                      tx.type === 'INCOME' ? 'text-green-600' : 
                      tx.type === 'EXPENSE' ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {tx.type === 'EXPENSE' ? '-' : tx.type === 'CHANGE' ? '+' : ''} R$ {tx.amount.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
