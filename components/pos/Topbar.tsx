'use client';

import React, { useState } from 'react';
import { Grid, Bell, User, LogOut, Settings, ChevronDown, Users } from 'lucide-react';
import { usePosStore } from '@/store/posStore';
import { useAuth } from '@/hooks/useAuth';

interface TopbarProps {
  onModuleChange: (module: string) => void;
  activeModule: string;
}

const Topbar: React.FC<TopbarProps> = ({ onModuleChange, activeModule }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const currentUser = usePosStore(s => s.currentUser);
  const { signOut } = useAuth();

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = async () => {
    setOpenMenu(null);
    await signOut();
  };

  return (
    <nav className="w-full h-[60px] bg-white border-b border-gray-100 flex items-center justify-between px-6 z-40 shadow-sm">
      {/* Left side: Brand/Page Title */}
      <div className="flex items-center gap-4">
        <img 
          src="https://pos.vendty.com//public/v2/img/logodas.fw.png" 
          alt="Vendty" 
          className="h-7 cursor-pointer"
          onClick={() => onModuleChange('dashboard')}
        />
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-2">
        {/* Apps Grid */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('apps')}
            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors relative outline-none focus-visible:ring-2 focus-visible:ring-[#62cb31]"
            aria-label="Abrir menú de aplicaciones"
            aria-expanded={openMenu === 'apps'}
          >
            <Grid size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Apps Dropdown */}
          {openMenu === 'apps' && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-2">Nuestras Apps</h3>
              <div className="grid grid-cols-2 gap-8">
                <div onClick={() => { onModuleChange('dashboard'); setOpenMenu(null); }}>
                  <AppItem 
                    img="https://vendty-img-new.s3.us-east-2.amazonaws.com/app-dashboard.png" 
                    name="Dashboard" 
                  />
                </div>
                <div onClick={() => { onModuleChange('ventas'); setOpenMenu(null); }}>
                  <AppItem 
                    img="https://vendty-img-new.s3.us-east-2.amazonaws.com/app-vendty-pos.png" 
                    name="Vendty POS" 
                  />
                </div>
                <AppItem 
                  img="https://vendty-img-new.s3.us-east-2.amazonaws.com/app-toma-pedido.png" 
                  name="Toma Pedido" 
                />
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button 
          className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors relative outline-none focus-visible:ring-2 focus-visible:ring-[#62cb31]"
          aria-label="Notificaciones"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px]" aria-label="2 notificaciones">2</span>
        </button>

        <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('user')}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#62cb31]"
            aria-label="Menú de usuario"
            aria-expanded={openMenu === 'user'}
          >
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-bold text-gray-700 leading-tight truncate max-w-[150px]">
                {currentUser?.nombre || 'Administrador'}
              </p>
              <p className="text-[9px] text-gray-400 leading-tight">
                {currentUser?.email || 'admin@milanpos.com'}
              </p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
              <User size={14} className="text-gray-400" />
            </div>
            <ChevronDown size={12} className="text-gray-400" />
          </button>

          {/* User Dropdown */}
          {openMenu === 'user' && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-gray-50 sm:hidden">
                <p className="text-sm font-bold text-gray-800 truncate">{currentUser?.nombre}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
              </div>
              
              {/* Show role badge */}
              <div className="px-4 py-2 border-b border-gray-50">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                  {currentUser?.rol || 'admin'}
                </span>
              </div>

              <button 
                onClick={() => { onModuleChange('usuarios'); setOpenMenu(null); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#62cb31] focus-visible:ring-inset"
              >
                <Users size={16} />
                <span>Administración</span>
              </button>

              <button 
                onClick={() => { onModuleChange('configuracion'); setOpenMenu(null); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#62cb31] focus-visible:ring-inset"
              >
                <Settings size={16} />
                <span>Configuración</span>
              </button>
              
              <div className="h-[1px] bg-gray-50 my-1"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#62cb31] focus-visible:ring-inset"
              >
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const AppItem: React.FC<{ img: string; name: string }> = ({ img, name }) => (
  <div className="flex flex-col items-center gap-2 group cursor-pointer">
    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors border border-gray-100 group-hover:border-green-100">
      <img src={img} alt={name} className="w-8 h-8 object-contain" />
    </div>
    <span className="text-[10px] font-medium text-gray-600 group-hover:text-green-600 transition-colors">{name}</span>
  </div>
);

export default Topbar;
