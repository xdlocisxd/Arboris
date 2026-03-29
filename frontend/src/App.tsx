import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
import { TreeRegistration } from '@/pages/TreeRegistration';
import { LoginPage } from '@/pages/LoginPage';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function AppContent() {
  const { token, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'register' | 'map' | 'activity'>('dashboard');

  if (isLoading) return null;

  if (!token) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'register':
        return <TreeRegistration />;
      case 'map':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-stone-100 rounded-3xl border border-dashed border-stone-300 h-64 mt-20">
            <h2 className="text-2xl font-bold text-stone-500 mb-2">Visualização do Mapa</h2>
            <p className="text-stone-400">Integração com Leaflet ou Mapbox ficará aqui.</p>
          </div>
        );
      case 'activity':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-stone-100 rounded-3xl border border-dashed border-stone-300 h-64 mt-20">
            <h2 className="text-2xl font-bold text-stone-500 mb-2">Atividade Recente</h2>
            <p className="text-stone-400">Lista detalhada de atividades da equipe e log de sincronização offline.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AppLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
