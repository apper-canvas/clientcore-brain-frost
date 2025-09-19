import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Page Not Found</h2>
        <p className="text-slate-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;