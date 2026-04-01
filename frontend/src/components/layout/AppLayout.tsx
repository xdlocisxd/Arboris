import { Home, Plus, Search, Map, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab?: 'dashboard' | 'register' | 'map' | 'search';
  onTabChange?: (tab: any) => void;
}

export function AppLayout({ children, activeTab = 'dashboard', onTabChange }: AppLayoutProps) {
  const { logout } = useAuth();
  
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'map', icon: Map, label: 'Mapa' },
    { id: 'register', icon: Plus, label: 'Monitorar', isMain: true },
    { id: 'search', icon: Search, label: 'Buscar' },
  ];

  return (
    <div className="flex h-screen flex-col bg-stone-100 text-stone-900 overflow-hidden selection:bg-green-700 selection:text-white">
      {/* Top App Bar with brutalist minimalist look */}
      <header className="flex items-center justify-between h-20 px-6 pt-8 pb-4 bg-stone-50 z-10 shadow-sm border-b border-stone-200/50 flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-green-950">
          FloraTrack
        </h1>
        <button 
          onClick={logout}
          className="p-2 text-stone-400 hover:text-red-600 transition-colors rounded-full hover:bg-stone-100"
          title="Sair"
        >
          <LogOut className="h-6 w-6" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
          {children}
        </div>
      </main>

      {/* Tactile Sticky Bottom Navigation */}
      <nav className="z-10 bg-stone-50 border-t border-stone-200/50 pb-safe shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)]">
        <ul className="flex justify-around items-center px-2 py-4 md:py-6 h-20 md:h-24 mx-auto max-w-2xl">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            if (tab.isMain) {
              return (
                <li key={tab.id} className="relative z-20 flex-shrink-0 -mt-10 md:-mt-12">
                  <button 
                    onClick={() => onTabChange?.(tab.id)}
                    className={cn(
                      "flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-[2rem] bg-green-600 shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-600/20",
                      isActive ? "bg-green-700" : "hover:bg-green-500"
                    )}
                  >
                    <Icon className="h-10 w-10 text-stone-50" strokeWidth={2.5} />
                  </button>
                </li>
              );
            }

            return (
              <li key={tab.id} className="flex-1 flex justify-center">
                <button
                  onClick={() => onTabChange?.(tab.id)}
                  className="group relative flex flex-col items-center justify-center space-y-1 rounded-2xl p-2 w-16 h-16"
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-stone-200/60 rounded-2xl" 
                    />
                  )}
                  <Icon 
                    className={cn(
                      "relative z-10 h-7 w-7 transition-colors", 
                      isActive ? "text-green-800" : "text-stone-400 group-hover:text-stone-600"
                    )} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
