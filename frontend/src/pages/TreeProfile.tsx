import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, TreeDeciduous, Calendar, Ruler, Wind, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

interface TreeProfileProps {
  treeId: string;
  onBack: () => void;
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export function TreeProfile({ treeId, onBack }: TreeProfileProps) {
  const { token } = useAuth();
  const [tree, setTree] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTree();
  }, [treeId]);

  const fetchTree = async () => {
    try {
      const data = await apiFetch(`/trees/${treeId}`, { token });
      setTree(data.tree);
    } catch (error) {
      console.error('Failed to fetch tree details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-12 h-12 border-4 border-stone-200 border-t-green-600 rounded-full animate-spin" />
      <span className="text-stone-400 font-bold animate-pulse">Sincronizando Perfil...</span>
    </div>
  );

  if (!tree) return (
    <div className="p-10 text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-20" />
      <h2 className="text-2xl font-black text-stone-900 tracking-tight">Indivíduo Perdido</h2>
      <button onClick={onBack} className="mt-6 bg-stone-900 text-white px-8 py-3 rounded-2xl font-bold active:scale-95 transition-transform">
        Voltar à busca
      </button>
    </div>
  );

  const Section = ({ title, icon: Icon, children, colorClass, index }: any) => (
    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 * (index || 0) }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 text-stone-900 mb-2">
        <div className={cn("p-2.5 rounded-2xl shadow-sm", colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-black text-xl tracking-tight">{title}</h3>
      </div>
      <Card className="p-8 border-none bg-white shadow-[0_15px_40px_-20px_rgba(0,0,0,0.08)] rounded-[2.5rem] space-y-6">
        {children}
      </Card>
    </motion.div>
  );

  const InfoRow = ({ label, value, sub }: any) => (
    <div className="group">
      <span className="block text-[10px] uppercase tracking-[0.2em] text-stone-400 font-black mb-2 group-hover:text-green-600 transition-colors">{label}</span>
      <span className="block text-stone-950 font-black text-2xl tracking-tighter leading-none">{value || '---'}</span>
      {sub && <span className="block text-xs text-stone-500 mt-2 font-medium bg-stone-50 w-fit px-2 py-0.5 rounded-md">{sub}</span>}
    </div>
  );

  return (
    <div className="space-y-12 pb-32 relative">
      {/* Organic Header */}
      <div className="relative -mx-6 -mt-8 pt-16 pb-24 px-8 bg-gradient-to-b from-stone-900 via-green-950 to-green-900 rounded-b-[4rem] shadow-2xl overflow-hidden">
        {/* Subtle Organic Pattern (Instead of massive text) */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-[100px] -mr-20 -mt-20 leading-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-[80px] -ml-20 -mb-20" />

        <motion.button 
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={onBack}
          className="relative z-20 w-12 h-12 flex items-center justify-center bg-white/10 rounded-2xl text-white backdrop-blur-xl mb-12 border border-white/10 hover:bg-white/20 transition-all active:scale-90"
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>

        <div className="flex items-center gap-6 relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-center shadow-inner border border-white/20"
          >
            <TreeDeciduous className="w-12 h-12 text-green-300" />
          </motion.div>
          <div className="flex-1 space-y-1">
            <motion.h2 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-black text-white tracking-tight leading-tight"
            >
              {tree.species}
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 text-green-400 font-bold text-xs uppercase tracking-widest"
            >
              <MapPin className="w-3.5 h-3.5" />
              {tree.locationName}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tactile Soft Cards */}
      <div className="flex gap-4 -mt-16 mx-1 relative z-20 px-2">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={cn(
            "flex-1 p-6 shadow-xl text-white rounded-[2.5rem] min-h-[140px] flex flex-col justify-between group overflow-hidden relative border border-white/10",
            tree.generalState === 'otimo' ? "bg-green-600/90" :
            tree.generalState === 'bom' ? "bg-blue-600/90" :
            tree.generalState === 'regular' ? "bg-orange-600/90" :
            "bg-red-600/90"
          )}
        >
          <Activity className="absolute -right-2 -bottom-2 w-24 h-24 text-white/10" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Status de Saúde</span>
          <span className="text-3xl font-black tracking-tight capitalize mt-2">{tree.generalState}</span>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="w-[42%] p-6 bg-white shadow-xl text-stone-800 rounded-[2.5rem] min-h-[140px] flex flex-col justify-between border border-stone-50"
        >
          <Calendar className="w-8 h-8 text-stone-200" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Data Registro</span>
            <span className="text-2xl font-black tracking-tight block text-stone-900">
              {new Date(tree.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Softer Detailed Info */}
      <div className="space-y-10 px-2 pb-20">
        
        <Section index={1} title="Biometria" icon={Ruler} colorClass="bg-blue-50 text-blue-600">
          <div className="grid grid-cols-1 gap-8">
            <InfoRow label="Altura do Indivíduo" value={`${tree.totalHeight}m`} sub="Crescimento vertical aproximado" />
            <div className="h-px bg-stone-50 w-full" />
            <InfoRow label="Diâmetro (DAP)" value={`${tree.dap}cm`} sub="Medição na altura do peito" />
          </div>
        </Section>

        <Section index={2} title="Bioindicadores" icon={Wind} colorClass="bg-emerald-50 text-emerald-600">
          <div className="space-y-8">
            <InfoRow 
              label="Presenças Ecológicas" 
              value={tree.ecologyIndicators?.indicators?.length > 0 
                ? tree.ecologyIndicators.indicators.join(' • ') 
                : 'Plexo Ausente'} 
              sub={`Nível: ${tree.ecologyIndicators?.diversity || 'Fundamental'}`}
            />
            <InfoRow 
              label="Fenologia Atual" 
              value={tree.phenology?.states?.length > 0 
                ? tree.phenology.states.join(' • ') 
                : 'Estágio Latente'} 
              sub={`Fase: ${tree.phenology?.intensity || 'N/A'}`}
            />
          </div>
        </Section>

        <Section index={3} title="Intervenção" icon={AlertCircle} colorClass="bg-stone-100 text-stone-600">
          <div className="flex items-center justify-between p-6 bg-stone-50/50 rounded-[2.5rem] border border-stone-100">
            <div className="space-y-1">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">
                {tree.managementType || 'Monitoramento'}
              </span>
              <p className="text-2xl font-black text-stone-800 tracking-tight leading-none">Urgência {tree.urgency || 'Normal'}</p>
            </div>
            <div className={cn(
              "w-14 h-14 rounded-[1.8rem] flex items-center justify-center shadow-lg",
              tree.urgency === 'imediata' ? "bg-red-500 shadow-red-100" : "bg-white"
            )}>
              {tree.urgency === 'imediata' ? <AlertCircle className="text-white w-7 h-7" /> : <CheckCircle2 className="text-stone-300 w-7 h-7" />}
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}
