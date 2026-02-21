import React, { useState } from 'react';
import { LogIn, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === 'cultura') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-xl mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Acceso Restringido</h1>
          <p className="text-zinc-500 text-sm">Identifícate para gestionar la asistencia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Usuario</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                className={`w-full bg-white border ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-200'} text-zinc-900 text-sm rounded-xl focus:ring-zinc-500 focus:border-zinc-500 block p-4 transition-all outline-none`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400">
                <LogIn size={18} />
              </div>
            </div>
            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-[10px] font-bold uppercase flex items-center gap-1 mt-1 ml-1"
              >
                <AlertCircle size={12} /> Usuario no autorizado
              </motion.p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            Entrar
          </motion.button>
        </form>

        <div className="pt-4 text-center">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
            Sistema de Gestión de Cultura
          </p>
        </div>
      </motion.div>
    </div>
  );
}
