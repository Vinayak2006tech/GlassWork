import React from 'react';
import { LoginForm } from './LoginForm';
import { HeroScene } from '../../components/three/HeroScene';
import { GlassCard } from '../../components/ui/GlassCard';

export const LoginPage: React.FC = () => {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 glass-mesh-bg relative overflow-hidden">
      {/* Subtle ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-300/30 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-violet-300/30 blur-3xl pointer-events-none"
      />

      {/* Main card grid */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left column: Login Card */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <GlassCard className="w-full max-w-md p-6 sm:p-8 shadow-2xl">
            <LoginForm />
          </GlassCard>
        </div>

        {/* Right column: 3D Decorative Scene (Visible on desktop/tablet) */}
        <div className="hidden lg:flex lg:col-span-7 h-[560px] w-full rounded-3xl overflow-hidden shadow-2xl border border-indigo-900/10">
          <HeroScene variant="login" className="w-full h-full" />
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
