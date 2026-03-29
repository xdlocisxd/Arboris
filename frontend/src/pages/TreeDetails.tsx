import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { ActionCard } from '@/components/ui/Card';
import { MapPin, Calendar, Activity, AlertTriangle, Images, Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function TreeDetails() {
  const tree = {
    species: 'Ipê Roxo (Handroanthus impetiginosus)',
    location: 'Praça da República, Zone 3',
    date: '12 de Out, 2025',
    dap: '45cm',
    height: '12m',
    status: 'Requer atenção',
    phytosanitary: 'Lagarta (Médio) - Folhas',
    history: [
      { date: '12 de Out, 2025', action: 'Registro Inicial' },
      { date: '05 de Jan, 2026', action: 'Poda realizada' },
    ]
  };

  return (
    <div className="pb-32 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 px-2">
        <h2 className="text-3xl font-bold tracking-tight text-green-950 leading-tight">
          {tree.species.split(' (')[0]}
        </h2>
        <p className="text-stone-500 italic mt-1 font-medium">
          {tree.species.includes('(') ? tree.species.split('(')[1].replace(')', '') : tree.species}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="flex items-center p-4">
          <div className="bg-stone-200 p-3 rounded-2xl mr-4">
            <MapPin className="text-stone-700 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Localização</p>
            <p className="text-stone-900 font-bold">{tree.location}</p>
          </div>
        </Card>
        
        <Card className="flex items-center p-4">
          <div className="bg-orange-100 p-3 rounded-2xl mr-4">
            <AlertTriangle className="text-orange-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Situação</p>
            <p className="text-orange-700 font-bold">{tree.status}</p>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold text-stone-900 mb-4 px-2">Medições</h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
            <ActionCard className="min-w-[140px] flex-1">
              <p className="text-stone-500 text-sm font-medium">Altura</p>
              <p className="text-3xl font-bold mt-1 text-stone-900">{tree.height}</p>
            </ActionCard>
            <ActionCard className="min-w-[140px] flex-1">
              <p className="text-stone-500 text-sm font-medium">DAP</p>
              <p className="text-3xl font-bold mt-1 text-stone-900">{tree.dap}</p>
            </ActionCard>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-stone-900 mb-4 px-2 tracking-tight">Histórico</h3>
          <Card className="p-6">
            <div className="relative border-l-2 border-green-200 ml-3 space-y-6">
              {tree.history.map((item, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-1 border-4 border-stone-50" />
                  <p className="font-bold text-stone-900">{item.action}</p>
                  <p className="text-sm text-stone-500 flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1" /> {item.date}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">Fotos</h3>
            <Button variant="ghost" size="sm" className="text-green-600">
              <Camera className="w-5 h-5 mr-2" /> Adicionar
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-square bg-stone-200 rounded-2xl flex items-center justify-center border-2 border-stone-300 border-dashed">
              <Images className="text-stone-400 w-8 h-8" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
