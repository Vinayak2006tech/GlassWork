import React from 'react';
import { Link } from 'react-router-dom';
import { HeroScene } from '../../components/visuals/HeroScene';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10">
      <div className="glass-panel-opaque p-10 rounded-3xl shadow-2xl border border-white/80 max-w-lg flex flex-col items-center">
        <div className="w-40 h-40 mb-6 flex items-center justify-center">
          <HeroScene variant="notfound" className="w-full h-full" />
        </div>

        <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50/80 px-3 py-1 rounded-full border border-indigo-100/60 mb-3">
          404 Error
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-md leading-relaxed">
          The page or resource you are looking for doesn't exist, was moved, or requires
          higher team permissions.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/projects">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              View Projects
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
