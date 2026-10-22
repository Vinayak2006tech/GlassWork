import React, { useState, useEffect } from 'react';
import {
  getSimulateErrorToggle,
  setSimulateErrorToggle,
  resetStorageToSeed,
} from '../../services/api';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Bug, RotateCcw } from 'lucide-react';

export const Footer: React.FC = () => {
  const [simulateError, setSimulateError] = useState(getSimulateErrorToggle);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setSimulateError(customEvent.detail);
    };
    window.addEventListener('simulate-error-change', handleSync);
    return () => {
      window.removeEventListener('simulate-error-change', handleSync);
    };
  }, []);

  const handleToggle = (checked: boolean) => {
    setSimulateError(checked);
    setSimulateErrorToggle(checked);
    if (checked) {
      toast.error('Simulated API errors ENABLED. API calls will now fail.', {
        id: 'simulate-error-toast',
      });
    } else {
      toast.success('Simulated API errors DISABLED. Normal operations resumed.', {
        id: 'simulate-error-toast',
      });
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all tasks and projects back to initial seed data?')) {
      resetStorageToSeed();
      queryClient.invalidateQueries();
      toast.success('Data reset back to original seed data!');
    }
  };

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/70 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Axionix Task Tracker</span>
          <span className="text-slate-300" aria-hidden="true">|</span>
          <span>Frontend Engineering Internship Assignment</span>
        </div>

        {/* Live Controls: Simulate Error & Reset Seed */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100/90 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
            <Bug
              className={`w-4 h-4 ${simulateError ? 'text-rose-600 animate-bounce' : 'text-slate-400'}`}
              aria-hidden="true"
            />
            <label
              htmlFor="simulate-error-toggle"
              className="text-xs font-medium text-slate-700 cursor-pointer select-none"
            >
              Simulate error
            </label>
            <input
              id="simulate-error-toggle"
              type="checkbox"
              checked={simulateError}
              onChange={(e) => handleToggle(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer"
            />
            {simulateError && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                Active
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1 transition-colors"
            title="Reset localStorage back to initial 20 seed tasks"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
