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
    <Card className="md:col-span-1 h-fit">
      <CardHeader>
        <CardTitle>Nova Transação</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select name="type" required value={type} onValueChange={(value) => value && setType(value)}>
              <SelectTrigger>
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
              <Label htmlFor="clothingItemId">Roupa (Opcional)</Label>
              <Select name="clothingItemId" onValueChange={(value: string | any) => value && handleClothingSelect(value as string)}>
                <SelectTrigger>
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
              <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
              <Select name="paymentMethod" defaultValue="CASH">
                <SelectTrigger>
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
            <Label htmlFor="description">Descrição</Label>
            <Input 
              id="description" 
              name="description" 
              required 
              placeholder="Ex: Venda de Blusa / Aluguel" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input 
              id="amount" 
              name="amount" 
              type="number" 
              step="0.01" 
              min="0" 
              required 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
