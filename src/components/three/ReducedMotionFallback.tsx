import React from 'react';
import { Layers, Sparkles } from 'lucide-react';

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
        className={`w-full h-24 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 p-6 flex items-center justify-between overflow-hidden relative shadow-md ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-200 border border-white/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-white text-base font-semibold">Team Workspace Overview</h2>
            <p className="text-indigo-200 text-xs">Real-time team throughput and sprint milestones</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium border border-white/15">
            Static View Mode
          </span>
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
        <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-indigo-600 font-bold text-2xl border border-indigo-100">
          404
        </div>
      </div>
    );
  }

  // Default login variant
  return (
    <div
      aria-hidden="true"
      className={`w-full h-full min-h-[400px] rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 p-8 flex flex-col justify-between overflow-hidden relative shadow-2xl ${className}`}
    >
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

      {/* Decorative top badge */}
      <div className="relative z-10 flex items-center gap-2 text-indigo-200 text-xs font-semibold tracking-wider uppercase">
        <Layers className="w-4 h-4 text-indigo-400" />
        <span>Axionix Enterprise Platform</span>
      </div>

      {/* Decorative center card presentation */}
      <div className="relative z-10 my-auto space-y-4">
        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl max-w-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white text-sm font-semibold">Active Sprint Status</span>
          </div>
          <p className="text-indigo-200 text-xs leading-relaxed">
            Coordinated team velocity across 4 cross-functional projects and sprint milestones.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg max-w-xs ml-auto">
          <div className="text-xs text-indigo-300 font-medium">Sprint Completion</div>
          <div className="text-lg font-bold text-white mt-0.5">85% On Target</div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="relative z-10 text-xs text-indigo-300/80">
        Accelerate software delivery with accessible, data-driven collaboration.
      </div>
    </div>
  );
};
