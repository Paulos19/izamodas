"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Tag, LogOut, ArrowRightLeft, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/actions/auth';

export default function Navigation() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Início', href: '/', icon: LayoutDashboard },
    { name: 'Roupas', href: '/roupas', icon: Tag },
    { name: 'Financeiro', href: '/financeiro', icon: ArrowRightLeft },
    { name: 'Perfil', href: '/perfil', icon: User },
  ];

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className={`hidden md:flex flex-col border-r bg-white transition-all duration-300 h-screen sticky top-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Collapse Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-white border shadow-sm rounded-full p-1 text-iza-700 hover:bg-iza-50 z-10"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="h-20 flex items-center justify-center border-b border-iza-50 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-iza-100 border-2 border-iza-300 flex items-center justify-center">
              <User size={20} className="text-iza-700" />
            </div>
            {!isCollapsed && <h1 className="text-xl font-bold text-iza-800">Iza Modas</h1>}
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-iza-700 text-white shadow-md shadow-iza-700/30' 
                    : 'text-gray-600 hover:bg-iza-50 hover:text-iza-700'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon size={22} className={isActive ? "text-white" : ""} />
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-iza-50">
          <form action={logout}>
            <Button 
              variant="ghost" 
              className={`w-full text-red-500 hover:text-red-600 hover:bg-red-50 ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`} 
              type="submit"
              title={isCollapsed ? "Sair" : undefined}
            >
              <LogOut size={22} className={!isCollapsed ? "mr-3" : ""} />
              {!isCollapsed && "Sair"}
            </Button>
          </form>
        </div>
      </aside>

      {/* --- MOBILE BOTTOM TABBAR --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-iza-100 flex justify-around items-center h-20 px-2 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className="flex flex-col items-center justify-center gap-1 w-[22%]"
            >
              <div className={`p-2 rounded-full ${isActive ? 'bg-iza-100' : ''}`}>
                <item.icon size={24} className={isActive ? "text-iza-700" : "text-gray-400"} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-iza-700' : 'text-gray-400'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
