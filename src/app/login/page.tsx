import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Izamodas</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar o painel.</CardDescription>
        </CardHeader>
        <form action={login}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="admin@izamodas.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">Entrar</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
