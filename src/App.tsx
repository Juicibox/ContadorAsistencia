/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Counter from './components/Counter';
import Login from './components/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if session exists (optional, for better UX)
  useEffect(() => {
    const session = sessionStorage.getItem('auth_session');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('auth_session', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('auth_session');
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 relative">
      {isAuthenticated ? (
        <>
          <div className="max-w-md mx-auto flex justify-end mb-4">
            <button 
              onClick={handleLogout}
              className="text-[10px] font-bold uppercase text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
          <Counter />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}
