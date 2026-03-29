import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ActionCard } from '@/components/ui/Card';
import { Activity, AlertTriangle, CheckCircle, Leaf, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Tree {
  id: string;
  species: string;
  locationName: string;
  generalState: string;
  createdAt: string;
}

export function Dashboard() {
  const { token, user } = useAuth();
  const [trees, setTrees] = useState<Tree[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiFetch('/trees', { token });
        setTrees(data.trees || []);
      } catch (error) {
        console.error('Failed to fetch trees:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const stats = [
    { label: 'Total Monitorado', value: trees.length.toString(), icon: Leaf, color: 'text-stone-800', bg: 'bg-stone-100' },
    { label: 'Saudáveis', value: trees.filter(t => t.generalState === 'otimo' || t.generalState === 'bom').length.toString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Críticas', value: trees.filter(t => t.generalState === 'pessimo' || t.generalState === 'morta').length.toString(), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Com Problemas', value: trees.filter(t => t.generalState === 'regular').length.toString(), icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-64">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        <p className="text-stone-500 mt-4">Carregando dados do servidor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-forwards">
      <header className="px-1">
        <h2 className="text-3xl font-bold tracking-tight text-stone-900">Olá, {user?.name}!</h2>
        <p className="text-stone-500 mt-1">Aqui está o resumo da sua área monitorada.</p>
      </header>

      <section>
        <h2 className="text-xl font-bold tracking-tight text-stone-900 mb-6 px-1">Visão Geral</h2>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <ActionCard key={i} className="flex flex-col space-y-4 shadow-sm p-5 md:p-6">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-2xl ${stat.bg}`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <h3 className="text-[2.5rem] leading-none font-bold text-stone-900 tracking-tighter">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-medium text-stone-500 mt-2">
                    {stat.label}
                  </p>
                </div>
              </ActionCard>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold tracking-tight text-stone-900 mb-6 px-1">Atividade Recente</h2>
        <div className="space-y-4">
          {trees.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-200">
              <p className="text-stone-400 font-medium">Nenhuma árvore registrada ainda.</p>
            </div>
          ) : (
            trees.slice(0, 5).map((item) => (
              <Card key={item.id} className="border-transparent hover:border-stone-200 transition-colors cursor-pointer active:scale-[0.98]">
                <div className="flex items-center p-4">
                  <div className={`w-3 h-3 rounded-full mr-4 flex-shrink-0 ${
                    (item.generalState === 'otimo' || item.generalState === 'bom') ? 'bg-green-500' :
                    (item.generalState === 'pessimo' || item.generalState === 'morta') ? 'bg-red-500' : 'bg-orange-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-stone-900 truncate">{item.species}</h4>
                    <p className="text-stone-500 truncate text-sm flex items-center mt-1">
                      <span className="truncate">{item.locationName || 'Local não informado'}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
