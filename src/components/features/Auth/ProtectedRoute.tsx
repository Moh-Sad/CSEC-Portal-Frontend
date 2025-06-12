'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      }
      setInitialCheckDone(true);
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !initialCheckDone) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#003081] to-[#001a3d] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/10 animate-ping"></div>
              <div className="relative w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                {/* SVG icon */}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Loading ...</h1>
            <p className="text-blue-100/80">Preparing everything for you!</p>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-white h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}