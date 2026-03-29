import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Leaf } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    
    try {
      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, password, name: 'Researcher' }),
      });
      
      if (!isRegistering) {
        login(data.user, data.token);
      } else {
        setIsRegistering(false);
        setError('Registered successfully! Now login.');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <Card className="max-w-md w-full p-8 shadow-xl bg-white border-stone-200">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center mb-4">
            <Leaf className="text-green-600 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Arboris PWA</h1>
          <p className="text-stone-500 mt-2 text-center">Monitoring trees for a greener city</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Email</label>
            <Input 
              type="email" 
              placeholder="seu@email.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Senha</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" variant="primary" className="w-full">
            {isRegistering ? 'Criar Conta' : 'Entrar'}
          </Button>

          <Button 
            type="button" 
            variant="ghost" 
            className="w-full text-stone-500 hover:text-stone-900"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Já tem conta? Login' : 'Não tem conta? Registre-se'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
