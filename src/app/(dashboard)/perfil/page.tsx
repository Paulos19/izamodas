import { logout } from '@/app/actions/auth'
import { LogOut, User, Settings, Shield, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PerfilPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header Profile */}
      <div className="flex flex-col items-center justify-center text-center mt-10">
        <div className="w-32 h-32 rounded-full bg-iza-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-iza-200 to-transparent opacity-50"></div>
          <User size={56} className="text-iza-700 relative z-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Iza Modas</h2>
        <p className="text-gray-500 mt-2 px-4 max-w-sm">
          Gerencie seu negócio, acompanhe seu estoque e turbine suas vendas.
        </p>
      </div>

      {/* Menu Options */}
      <div className="bg-white rounded-3xl shadow-sm border border-iza-50 overflow-hidden mt-8">
        <div className="flex items-center gap-4 p-5 border-b border-iza-50 hover:bg-iza-50/50 cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Settings size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">Configurações da Conta</p>
            <p className="text-sm text-gray-500">Altere seus dados de acesso</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 border-b border-iza-50 hover:bg-iza-50/50 cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
            <Shield size={20} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">Segurança</p>
            <p className="text-sm text-gray-500">Senhas e autenticação</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 border-b border-iza-50 hover:bg-iza-50/50 cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
            <HelpCircle size={20} className="text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">Ajuda e Suporte</p>
            <p className="text-sm text-gray-500">Fale com o desenvolvedor</p>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-8 md:hidden">
        <form action={logout}>
          <Button 
            variant="outline" 
            className="w-full py-6 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold shadow-sm" 
            type="submit"
          >
            <LogOut size={20} className="mr-2" />
            Sair da Conta
          </Button>
        </form>
      </div>
    </div>
  )
}
