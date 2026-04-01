import React, { useState, useEffect } from 'react';
import { Search, MapPin, TreeDeciduous, ChevronRight, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Tree {
  id: string;
  species: string;
  locationName: string;
  generalState: string;
  createdAt: string;
}

interface TreeSearchProps {
  onSelectTree: (id: string) => void;
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export function TreeSearch({ onSelectTree }: TreeSearchProps) {
  const { token } = useAuth();
  const [trees, setTrees] = useState<Tree[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    try {
      const data = await apiFetch('/trees', { token });
      setTrees(data.trees || []);
    } catch (error) {
      console.error('Failed to fetch trees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTrees = trees.filter(tree => 
    tree.species.toLowerCase().includes(search.toLowerCase()) ||
    tree.locationName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-green-100 to-sage-100 rounded-[2.2rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5 pointer-events-none group-focus-within:text-green-500 transition-colors" />
        <Input 
          className="relative pl-14 h-16 text-lg bg-white/80 backdrop-blur-xl border-none shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] rounded-[2rem] focus:ring-2 focus:ring-green-100 transition-all placeholder:text-stone-300 font-medium"
          placeholder="Pesquisar indivíduos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </motion.div>

      <div className="flex items-center justify-between px-3">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-stone-800 tracking-tight leading-none">Biodiversidade</h2>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{filteredTrees.length} registrados</p>
        </div>
        <button className="w-12 h-12 flex items-center justify-center bg-white shadow-sm border border-stone-100 rounded-2xl text-stone-400 hover:text-green-600 hover:border-green-100 transition-all">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-stone-100/60 rounded-[2.5rem] animate-pulse" />
            ))
          ) : filteredTrees.length > 0 ? (
            filteredTrees.map((tree, index) => (
              <motion.div
                key={tree.id}
                layout
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100, delay: index * 0.03 }}
              >
                <Card 
                  onClick={() => onSelectTree(tree.id)}
                  className="p-1 border-none bg-white/60 backdrop-blur-sm shadow-[0_4px_15px_-8px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] transition-all cursor-pointer group rounded-[2.5rem]"
                >
                  <div className="flex items-center p-3 gap-5">
                    <div className={cn(
                      "w-16 h-16 rounded-[2rem] flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-all duration-500",
                      tree.generalState === 'otimo' ? "bg-green-50 text-green-600" :
                      tree.generalState === 'bom' ? "bg-blue-50 text-blue-600" :
                      tree.generalState === 'regular' ? "bg-orange-50 text-orange-600" :
                      "bg-red-50 text-red-600"
                    )}>
                      <TreeDeciduous className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-stone-800 truncate tracking-tight group-hover:text-green-700 transition-colors">{tree.species}</h3>
                      <div className="flex items-center gap-1.5 text-stone-400 text-sm font-medium mt-1">
                        <MapPin className="w-3.5 h-3.5 opacity-50" />
                        <span className="truncate">{tree.locationName}</span>
                      </div>
                    </div>
                    
                    <div className="pr-4">
                      <ChevronRight className="text-stone-200 group-hover:text-green-300 w-5 h-5 transition-all group-hover:translate-x-1" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center space-y-4"
            >
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto opacity-40">
                <Search className="text-stone-300 w-8 h-8" />
              </div>
              <div>
                <p className="text-stone-800 font-bold text-lg">Nada encontrado</p>
                <p className="text-stone-400 text-sm max-w-[200px] mx-auto mt-1">Não encontramos nenhum registro para sua busca.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
