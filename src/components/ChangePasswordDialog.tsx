'use client'

import { useState } from 'react'
import { changePassword } from '@/app/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    setError(null)
    setSuccess(false)
    
    const result = await changePassword(formData)
    
    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
      }, 2000)
    }
    
    setIsPending(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-4 p-5 border-b border-iza-50 hover:bg-iza-50/50 cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
            <Shield size={20} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">Segurança</p>
            <p className="text-sm text-gray-500">Senhas e autenticação</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <KeyRound size={24} className="text-purple-600" />
          </div>
          <DialogTitle className="text-center text-xl font-bold">Trocar Senha</DialogTitle>
          <DialogDescription className="text-center">
            Mantenha sua conta segura alterando sua senha regularmente.
          </DialogDescription>
        </DialogHeader>
        
        {success ? (
          <div className="flex flex-col items-center justify-center py-6 text-green-600">
            <CheckCircle2 size={48} className="mb-2" />
            <p className="font-bold text-lg">Senha alterada!</p>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-4 mt-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm font-medium">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input 
                id="currentPassword" 
                name="currentPassword" 
                type="password" 
                required 
                className="rounded-xl border-gray-200 focus-visible:ring-purple-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input 
                id="newPassword" 
                name="newPassword" 
                type="password" 
                required 
                className="rounded-xl border-gray-200 focus-visible:ring-purple-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                required 
                className="rounded-xl border-gray-200 focus-visible:ring-purple-400"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-6 mt-4 shadow-md shadow-purple-500/20 font-bold"
            >
              {isPending ? 'Alterando...' : 'Confirmar Alteração'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
