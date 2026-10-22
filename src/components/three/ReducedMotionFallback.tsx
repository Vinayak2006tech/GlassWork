import React from 'react';
import { Layers, Sparkles, CheckCircle2, TrendingUp, Users } from 'lucide-react';

interface ReducedMotionFallbackProps {
  variant?: 'login' | 'dashboard' | 'notfound';
  className?: string;
}

export const ReducedMotionFallback: React.FC<ReducedMotionFallbackProps> = ({
  variant = 'login',
  className = '',
}) => {
  if (variant === 'dashboard') {
    return (
      <div
        aria-hidden="true"
        className={`w-full h-24 rounded-2xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-violet-950 p-6 flex items-center justify-between overflow-hidden relative shadow-md border border-indigo-800/30 ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-300 border border-white/20 shadow-xs">
            <Sparkles className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-white text-base font-semibold">Workspace Intelligence</h2>
            <p className="text-indigo-200 text-xs">Real-time team throughput, milestone pacing, and sprint health</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 relative z-10">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Systems Optimal</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'notfound') {
    return (
      <div
        aria-hidden="true"
        className={`w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-purple-500/10 flex items-center justify-center border border-indigo-200/50 shadow-inner ${className}`}
      >
        <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center text-indigo-600 font-extrabold text-3xl border border-indigo-100">
          404
        </div>
      </div>
    );
  }

  // Default login variant
  return (
    <div
      aria-hidden="true"
      className={`w-full h-full min-h-[460px] rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950 p-8 flex flex-col justify-between overflow-hidden relative shadow-2xl border border-indigo-800/40 ${className}`}
    >
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

      {/* Decorative top branding */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold tracking-wider uppercase">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Axionix Enterprise Platform</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[11px] font-medium">
          v2.4
        </span>
      </div>

      {/* Center presentation glass panels */}
      <div className="relative z-10 my-auto space-y-4">
        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white text-sm font-semibold">Active Sprint Velocity</span>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-indigo-200 text-xs leading-relaxed">
            Coordinated team velocity across 4 cross-functional projects and sprint milestones.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg">
            <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Team Members</span>
            </div>
            <div className="text-lg font-bold text-white mt-1">5 Active</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg">
            <div className="text-xs text-indigo-300 font-medium">Sprint Pacing</div>
            <div className="text-lg font-bold text-white mt-1">94% On Target</div>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="relative z-10 text-xs text-indigo-300/80">
        Accelerate software delivery with accessible, data-driven team collaboration.
      </div>
    </div>
  );
};
