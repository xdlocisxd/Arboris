import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ChipGroup } from '@/components/ui/Chip';
import { getDraft, saveDraft, clearDraft, TreeData } from '@/store/draftStore';
import { ArrowLeft, ArrowRight, Save, Camera, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const steps = [
  'Info Básica', 'Medições', 'Condição', 'Fitossanidade',
  'Ecologia', 'Fenologia', 'Infraestrutura', 'Manejo'
];

export function TreeRegistration() {
  const { token } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<TreeData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    getDraft().then(draft => {
      if (draft) setData(draft);
      setIsLoading(false);
    });
  }, []);

  const handleChange = (stepKey: keyof TreeData, field: string, value: any) => {
    setData(prev => {
      const newData = {
        ...prev,
        [stepKey]: { ...(prev[stepKey] as any), [field]: value }
      };
      saveDraft(newData);
      return newData;
    });
  };

  const handleFinish = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');
    try {
      // The backend expects an array of trees
      await apiFetch('/trees/sync', {
        method: 'POST',
        token,
        body: JSON.stringify({ trees: [data] }),
      });
      
      setSyncStatus('success');
      await clearDraft();
      setTimeout(() => {
        window.location.reload(); // Simple way to go back to dashboard in this tab-based app
      }, 1500);
    } catch (error: any) {
      console.error('Full Sync Error:', error);
      if (error.body) {
        console.error('Server side error body:', await (typeof error.body === 'string' ? JSON.parse(error.body) : error.body));
      }
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-stone-500">Carregando rascunho...</div>;

  if (syncStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center animate-in zoom-in-95 duration-500 h-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="text-green-600 w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-stone-900 mb-2">Sincronizado!</h2>
        <p className="text-stone-500">Os dados da árvore foram salvos no servidor com sucesso.</p>
      </div>
    );
  }

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-stone-900 font-bold mb-3 text-lg">Espécie</label>
              <Input 
                placeholder="ex. Ipê Amarelo" 
                value={data.step1?.species || ''}
                onChange={e => handleChange('step1', 'species', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-stone-900 font-bold mb-3 text-lg">Localização</label>
              <Input 
                placeholder="Nome da praça ou parque" 
                value={data.step1?.location || ''}
                onChange={e => handleChange('step1', 'location', e.target.value)}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-stone-900 font-bold mb-3 text-lg">Altura Total (m)</label>
              <Input 
                type="number"
                step="0.1"
                placeholder="ex. 12.5" 
                value={data.step2?.totalHeight || ''}
                onChange={e => handleChange('step2', 'totalHeight', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-stone-900 font-bold mb-3 text-lg">DAP (cm)</label>
              <Input 
                type="number"
                step="0.1"
                placeholder="ex. 45.0" 
                value={data.step2?.dap || ''}
                onChange={e => handleChange('step2', 'dap', e.target.value)}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-stone-900 font-bold mb-4 text-xl">Estado Geral</label>
              <ChipGroup
                options={[
                  { label: 'Ótimo', value: 'otimo' },
                  { label: 'Bom', value: 'bom' },
                  { label: 'Regular', value: 'regular' },
                  { label: 'Péssimo', value: 'pessimo' },
                  { label: 'Morta', value: 'morta' },
                ]}
                value={data.step3?.state || ''}
                onChange={val => handleChange('step3', 'state', val)}
              />
            </div>
            <div>
              <label className="block text-stone-900 font-bold mb-4 text-xl">Apresenta Equilíbrio?</label>
              <ChipGroup
                options={[
                  { label: 'Sim', value: 'yes' },
                  { label: 'Não', value: 'no' },
                ]}
                value={data.step3?.balance || ''}
                onChange={val => handleChange('step3', 'balance', val)}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-stone-900 font-bold mb-4 text-xl">Tipo de Praga</label>
              <ChipGroup
                options={[
                  { label: 'Cupim', value: 'cupim' },
                  { label: 'Lagarta', value: 'lagarta' },
                  { label: 'Formiga', value: 'formiga' },
                  { label: 'Cochonilha', value: 'cochonilha' },
                  { label: 'Nenhum', value: 'none' },
                ]}
                value={data.step4?.pestType || ''}
                onChange={val => handleChange('step4', 'pestType', val)}
              />
            </div>
            <div>
              <label className="block text-stone-900 font-bold mb-4 text-xl">Intensidade</label>
              <ChipGroup
                options={[
                  { label: 'Leve', value: 'leve' },
                  { label: 'Médio', value: 'medio' },
                  { label: 'Pesado', value: 'pesado' },
                ]}
                value={data.step4?.intensity || ''}
                onChange={val => handleChange('step4', 'intensity', val)}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-10">
            <div>
              <label className="block text-stone-900 font-bold mb-4 text-xl">Presença de Vida e Biodiversidade</label>
              <ChipGroup
                multiple
                options={[
                  { label: 'Artrópodes (insetos)', value: 'arthropods' },
                  { label: 'Líquens', value: 'lichens' },
                  { label: 'Epífitas', value: 'epiphytes' },
                  { label: 'Parasitas', value: 'parasites' },
                ]}
                value={data.step5?.indicators || []}
                onChange={val => handleChange('step5', 'indicators', val)}
              />
            </div>
            <div>
              <label className="block text-stone-900 font-bold mb-4 text-xl">Diversidade Observada</label>
              <ChipGroup
                options={[
                  { label: 'Baixa', value: 'baixa' },
                  { label: 'Média', value: 'media' },
                  { label: 'Alta', value: 'alta' },
                  { label: 'Nenhuma', value: 'none' },
                ]}
                value={data.step5?.diversity || ''}
                onChange={val => handleChange('step5', 'diversity', val)}
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-10">
            <div>
              <label className="block text-stone-900 font-bold mb-4 text-xl">Estados Fenológicos Atuais</label>
              <ChipGroup
                multiple
                options={[
                  { label: 'Folha', value: 'leaf' },
                  { label: 'Flor', value: 'flower' },
                  { label: 'Fruto', value: 'fruit' },
                ]}
                value={data.step6?.states || []}
                onChange={val => handleChange('step6', 'states', val)}
              />
            </div>
            <div>
              <label className="block text-stone-900 font-bold mb-4 text-xl">Intensidade Fenológica</label>
              <ChipGroup
                options={[
                  { label: 'Início', value: 'start' },
                  { label: 'Pico', value: 'peak' },
                  { label: 'Fim', value: 'end' },
                  { label: 'Ausente', value: 'none' },
                ]}
                value={data.step6?.intensity || ''}
                onChange={val => handleChange('step6', 'intensity', val)}
              />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-stone-900 font-bold mb-4 text-xl">Fiação Elétrica Próxima?</label>
              <ChipGroup
                options={[
                  { label: 'Sim, em conflito', value: 'conflict' },
                  { label: 'Sim, distância segura', value: 'safe' },
                  { label: 'Não', value: 'no' },
                ]}
                value={data.step7?.electricalWiring || ''}
                onChange={val => handleChange('step7', 'electricalWiring', val)}
              />
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-10">
            <div>
              <label className="block text-stone-900 font-bold mb-4 text-xl">Tipo de Manejo Recomendado</label>
              <ChipGroup
                options={[
                  { label: 'Poda', value: 'poda' },
                  { label: 'Adubação', value: 'adubacao' },
                  { label: 'Irrigação', value: 'irrigacao' },
                  { label: 'Remoção', value: 'remocao' },
                  { label: 'Nenhum', value: 'none' },
                ]}
                value={data.step8?.managementType || ''}
                onChange={val => handleChange('step8', 'managementType', val)}
              />
            </div>
            <div>
              <label className="block text-stone-900 font-bold mb-4 text-xl">Urgência da Ação</label>
              <ChipGroup
                options={[
                  { label: 'Baixa', value: 'baixa' },
                  { label: 'Média', value: 'media' },
                  { label: 'Alta', value: 'alta' },
                  { label: 'Urgente', value: 'imediata' },
                ]}
                value={data.step8?.urgency || ''}
                onChange={val => handleChange('step8', 'urgency', val)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-32 flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-3xl font-bold tracking-tight text-stone-900">Registro</h2>
        <Button variant="ghost" size="sm" onClick={() => saveDraft(data)} className="text-green-700">
          <Save className="w-5 h-5 mr-2" /> Rascunho
        </Button>
      </div>

      {/* Modern Top Stepper */}
      <div className="mb-8 px-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-2">
        {steps.map((step, idx) => (
          <div 
            key={idx} 
            onClick={() => setCurrentStep(idx)}
            className={`flex-shrink-0 h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
              idx === currentStep ? 'bg-green-600 shadow-sm shadow-green-600/20' : 
              idx < currentStep ? 'bg-green-400' : 'bg-stone-200'
            }`} 
            title={step}
          />
        ))}
      </div>

      <h3 className="text-2xl font-bold text-green-950 mb-8 px-2">
        {currentStep + 1}. {steps[currentStep]}
      </h3>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-0 shadow-none bg-transparent">
              {renderStep()}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {syncStatus === 'error' && (
        <p className="text-red-500 text-sm text-center mb-4">Falha ao salvar. Tente novamente.</p>
      )}

      {/* Sticky Bottom Form Navigation (Above AppLayout nav) */}
      <div className="fixed bottom-24 left-0 right-0 p-4 bg-gradient-to-t from-stone-50 via-stone-50 to-transparent z-20 md:static md:bg-none md:p-0 md:mt-12 md:max-w-2xl md:mx-auto pt-10 pointer-events-none">
        <div className="flex justify-between gap-4 w-full pointer-events-auto max-w-2xl mx-auto px-4 md:px-0">
          <Button 
            variant="secondary" 
            size="massive"
            className="w-1/3"
            disabled={currentStep === 0 || isSyncing}
            onClick={() => setCurrentStep(p => Math.max(0, p - 1))}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <Button 
            variant="primary" 
            size="massive"
            className="w-2/3"
            isLoading={isSyncing}
            onClick={() => {
              if (currentStep === steps.length - 1) {
                handleFinish();
              } else {
                setCurrentStep(p => Math.min(steps.length - 1, p + 1));
              }
            }}
          >
            {currentStep === steps.length - 1 ? 'Finalizar e Salvar' : 'Próximo'}
            {currentStep !== steps.length - 1 && <ArrowRight className="w-6 h-6 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
