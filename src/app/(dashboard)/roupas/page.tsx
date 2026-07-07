import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import EditClothingDialog from '@/components/EditClothingDialog'
import { Tag, Search } from 'lucide-react'

async function addClothingItem(formData: FormData) {
  'use server'
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)

  if (name && !isNaN(price)) {
    await prisma.clothingItem.create({
      data: { name, description, price }
    })
    revalidatePath('/roupas')
  }
}

export default async function RoupasPage() {
  const items = await prisma.clothingItem.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mt-2 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Estoque</h2>
          <p className="text-sm text-gray-500">Gerencie suas peças de roupa</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Formulário */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-iza-50 sticky top-24">
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <span className="p-2 bg-iza-100 text-iza-700 rounded-full">
                <Tag size={18} />
              </span>
              Nova Peça
            </h3>
            <form action={addClothingItem} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-600 font-medium text-sm">Nome da Peça</Label>
                <Input id="name" name="name" required placeholder="Ex: Vestido Floral" className="rounded-xl border-gray-200 focus-visible:ring-iza-400 bg-gray-50/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-600 font-medium text-sm">Descrição <span className="text-gray-400 font-normal">(Opcional)</span></Label>
                <Input id="description" name="description" placeholder="Detalhes" className="rounded-xl border-gray-200 focus-visible:ring-iza-400 bg-gray-50/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-600 font-medium text-sm">Preço (R$)</Label>
                <Input id="price" name="price" type="number" step="0.01" min="0" required placeholder="0,00" className="rounded-xl border-gray-200 focus-visible:ring-iza-400 bg-gray-50/50 text-lg font-semibold" />
              </div>
              <Button type="submit" className="w-full bg-iza-600 hover:bg-iza-700 text-white rounded-xl py-6 mt-2 shadow-md shadow-iza-500/20 font-bold">
                Cadastrar Peça
              </Button>
            </form>
          </div>
        </div>

        {/* Lista de Roupas */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm border border-iza-50">
            <span className="text-sm font-medium text-gray-500">{items.length} peças cadastradas</span>
            <div className="p-2 bg-gray-50 rounded-full">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-iza-50 shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-iza-50 rounded-full flex items-center justify-center mb-4">
                <Tag size={32} className="text-iza-300" />
              </div>
              <h4 className="text-lg font-bold text-gray-700">Seu estoque está vazio</h4>
              <p className="text-gray-500 mt-2">Cadastre sua primeira peça de roupa usando o formulário ao lado.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-iza-50 flex flex-col justify-between group hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800 line-clamp-2 leading-tight flex-1 pr-2">{item.name}</h4>
                      <div className="text-right">
                        <span className="text-sm text-iza-600 font-medium opacity-80 mr-1">R$</span>
                        <span className="text-xl font-bold text-iza-700">{item.price.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <EditClothingDialog item={item} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
