import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Roupas</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Cadastrar Roupa</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addClothingItem} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Peça</Label>
                <Input id="name" name="name" required placeholder="Ex: Vestido Estampado" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input id="description" name="description" placeholder="Opcional" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input id="price" name="price" type="number" step="0.01" min="0" required placeholder="0.00" />
              </div>
              <Button type="submit" className="w-full">Cadastrar</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Peças Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">Nenhuma roupa cadastrada.</TableCell>
                  </TableRow>
                ) : (
                  items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">R$ {item.price.toFixed(2).replace('.', ',')}</TableCell>
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
