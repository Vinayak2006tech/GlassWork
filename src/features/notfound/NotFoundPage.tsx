import React from 'react';
import { Link } from 'react-router-dom';
import { HeroScene } from '../../components/three/HeroScene';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-48 h-48 mb-6 flex items-center justify-center">
        <HeroScene variant="notfound" className="w-full h-full" />
      </div>

      <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-3">
        404 Error
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-2 text-sm text-slate-600 max-w-md">
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
    </main>
  );
};

export default NotFoundPage;
