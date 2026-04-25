'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import Sidebar from '@/components/pos/Sidebar';
import Topbar from '@/components/pos/Topbar';
import SubMenuTabs from '@/components/pos/SubMenuTabs';
import Dashboard from '@/components/pos/Dashboard';
import { useAuth } from '@/hooks/useAuth';
import { useStoreHydration } from '@/hooks/useStoreHydration';
import { useNetworkMonitor } from '@/hooks/useNetworkMonitor';
import { usePosStore } from '@/store/posStore';
import { hasModuleAccess } from '@/lib/rbac';
import { RoleGate } from '@/lib/rbac';
import Login from '@/components/pos/auth/Login';

// Lazy-load módulos pesados para mejorar el tiempo de carga
const Vender = lazy(() => import('@/components/pos/modules/Vender'));
const Inventario = lazy(() => import('@/components/pos/modules/Inventario'));
const Ventas = lazy(() => import('@/components/pos/modules/Ventas'));
const ConfiguracionNegocio = lazy(() => import('@/components/pos/modules/ConfiguracionNegocio'));
const Informes = lazy(() => import('@/components/pos/modules/Informes'));
const UsuariosAdmin = lazy(() => import('@/components/pos/modules/UsuariosAdmin'));
const Tienda = lazy(() => import('@/components/pos/modules/Tienda'));
const Contactos = lazy(() => import('@/components/pos/modules/Contactos'));
const Compras = lazy(() => import('@/components/pos/modules/Compras'));
const Fidelizacion = lazy(() => import('@/components/pos/modules/Fidelizacion'));
const Nomina = lazy(() => import('@/components/pos/modules/Nomina'));

// Loading fallback para lazy modules
function ModuleLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Cargando módulo...</p>
      </div>
    </div>
  );
}

// Access denied component
function AccessDenied({ module }: { module: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-white rounded-2xl border border-red-100 p-12">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V9a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h3 className="text-xl font-black text-gray-800 mb-2">Acceso Restringido</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm">
        No tienes permisos para acceder al módulo <span className="font-bold text-red-500 uppercase">{module}</span>. 
        Contacta al administrador del sistema.
      </p>
    </div>
  );
}

export default function Home() {
  const { loading: authLoading } = useAuth();
  const storeHydrated = useStoreHydration();
  const currentUser = usePosStore(s => s.currentUser);
  const currentRole = usePosStore(s => s.currentRole);
  
  // Activate network monitoring + offline sync engine (#11, #17)
  useNetworkMonitor();
  
  // State with localStorage persistence
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [activeSubMenu, setActiveSubMenu] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state on mount
  useEffect(() => {
    const savedModule = localStorage.getItem('activeModule');
    const savedSubMenu = localStorage.getItem('activeSubMenu');
    if (savedModule) setActiveModule(savedModule);
    if (savedSubMenu) setActiveSubMenu(savedSubMenu);

    // Support ?demo=admin or ?demo=cajero query param for easy login
    const params = new URLSearchParams(window.location.search);
    const demoRole = params.get('demo');
    if (demoRole && ['admin', 'gerente', 'cajero', 'bodeguero'].includes(demoRole)) {
      const setUser = usePosStore.getState().setUser;
      setUser({
        nombre: `Demo ${demoRole.charAt(0).toUpperCase() + demoRole.slice(1)}`,
        email: `demo.${demoRole}@milanpos.com`,
        rol: demoRole as 'admin' | 'gerente' | 'cajero' | 'bodeguero',
      });
      // Clean URL
      window.history.replaceState({}, '', '/');
    }

    setIsHydrated(true);
  }, []);

  // Save state on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('activeModule', activeModule);
      localStorage.setItem('activeSubMenu', activeSubMenu);
    }
  }, [activeModule, activeSubMenu, isHydrated]);

  // Wait for BOTH Zustand store hydration AND local state hydration
  if (authLoading || !isHydrated || !storeHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  const onModuleChange = (module: string, sub: string = '') => {
    setActiveModule(module);
    setActiveSubMenu(sub);
  };

  // Tarea #7: RBAC at the routing level — blocks unauthorized access even if URL is forced
  const renderModule = () => {
    const moduleId = activeModule === 'ventas' && activeSubMenu === 'vender' ? 'vender' : activeModule;
    
    // Dashboard is accessible to everyone
    if (moduleId === 'dashboard') {
      return <Dashboard onModuleChange={onModuleChange} />;
    }

    // Check RBAC before rendering
    if (!hasModuleAccess(moduleId, currentRole)) {
      return <AccessDenied module={moduleId} />;
    }

    switch (activeModule) {
      case 'vender':
        return <Vender />;
      case 'ventas':
        if (activeSubMenu === 'vender') {
          return <Vender />;
        }
        return <Ventas subMenu={activeSubMenu} />;
      case 'inventario':
        return <Inventario subMenu={activeSubMenu} />;
      case 'usuarios':
        return (
          <RoleGate allowed={['admin']} currentRole={currentRole} fallback={<AccessDenied module="usuarios" />}>
            <UsuariosAdmin subMenu={activeSubMenu} />
          </RoleGate>
        );
      case 'configuracion':
        return (
          <RoleGate allowed={['admin']} currentRole={currentRole} fallback={<AccessDenied module="configuración" />}>
            <ConfiguracionNegocio subMenu={activeSubMenu} />
          </RoleGate>
        );
      case 'informes':
        return <Informes subMenu={activeSubMenu} />;
      case 'tienda':
        return <Tienda subMenu={activeSubMenu} />;
      case 'contactos':
        return <Contactos subMenu={activeSubMenu} />;
      case 'compras':
        return <Compras subMenu={activeSubMenu} />;
      case 'fidelizacion':
        return <Fidelizacion subMenu={activeSubMenu} />;
      case 'nomina':
        return <Nomina subMenu={activeSubMenu} />;
      default:
        return <Dashboard onModuleChange={onModuleChange} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f4f7f6]">
      {/* Sidebar - Fixed width, full height */}
      <div className="flex-none relative z-[100]">
        <Sidebar 
          activeModule={activeModule} 
          setActiveModule={setActiveModule}
          activeSubMenu={activeSubMenu}
          setActiveSubMenu={setActiveSubMenu}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar - Fixed height */}
        <div className="flex-none shadow-sm z-40 relative">
          <Topbar 
            activeModule={activeModule}
            onModuleChange={setActiveModule}
          />
        </div>

        {/* Scrollable Content with Suspense for lazy modules */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1600px] mx-auto">
            <Suspense fallback={<ModuleLoader />}>
              {renderModule()}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
