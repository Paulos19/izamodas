'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type ClothingItem = {
  id: string
  name: string
  price: number
}

interface TransactionFormProps {
  clothingItems: ClothingItem[]
  onSubmit: (formData: FormData) => Promise<void>
}

export function TransactionForm({ clothingItems, onSubmit }: TransactionFormProps) {
  const [type, setType] = useState('INCOME')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [isPending, setIsPending] = useState(false)

  const handleClothingSelect = (id: string) => {
    if (id === 'none') {
      setDescription('')
      setAmount('')
      return
    }
    const item = clothingItems.find(c => c.id === id)
    if (item) {
      setDescription(`Venda: ${item.name}`)
      setAmount(item.price.toString())
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    await onSubmit(formData)
    setDescription('')
    setAmount('')
    setIsPending(false)
  }

  return (
    <div className="md:col-span-1">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-iza-50 sticky top-24">
        <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <span className="p-2 bg-iza-100 text-iza-700 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </span>
          Nova Transação
        </h3>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-600 font-medium text-sm">Tipo</Label>
            <Select name="type" required value={type} onValueChange={(value) => value && setType(value)}>
              <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50 focus:ring-iza-400">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Entrada</SelectItem>
                <SelectItem value="EXPENSE">Gasto (Saída)</SelectItem>
                <SelectItem value="CHANGE">Troco (Fundo de Caixa)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'INCOME' && clothingItems.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="clothingItemId" className="text-gray-600 font-medium text-sm">Roupa (Opcional)</Label>
              <Select name="clothingItemId" onValueChange={(value: string | any) => value && handleClothingSelect(value as string)}>
                <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50 focus:ring-iza-400">
                  <SelectValue placeholder="Selecione uma peça cadastrada" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma (Venda Avulsa)</SelectItem>
                  {clothingItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - R$ {item.price.toFixed(2).replace('.', ',')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {type === 'INCOME' && (
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-gray-600 font-medium text-sm">Forma de Pagamento</Label>
              <Select name="paymentMethod" defaultValue="CASH">
                <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50 focus:ring-iza-400">
                  <SelectValue placeholder="Selecione a forma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Dinheiro / Pix</SelectItem>
                  <SelectItem value="CARD">Cartão (Crédito/Débito)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-600 font-medium text-sm">Descrição</Label>
            <Input
              id="description"
              name="description"
              required
              placeholder="Ex: Venda de Blusa / Aluguel"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-iza-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-600 font-medium text-sm">Valor (R$)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl border-gray-200 bg-gray-50/50 focus-visible:ring-iza-400 text-lg font-semibold"
            />
          </div>
          <Button type="submit" className="w-full bg-iza-600 hover:bg-iza-700 text-white rounded-xl py-6 mt-2 shadow-md shadow-iza-500/20 font-bold" disabled={isPending}>
            {isPending ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
