import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="relative mb-8">
        <h1 className="text-9xl font-black text-primary/10">404</h1>
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
          Page Not Found
        </p>
      </div>
      <p className="text-muted-foreground mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved to a new destination.
      </p>
      <Button onClick={() => navigate('/')} size="lg" className="rounded-full px-8">
        Back to Safety
      </Button>
    </div>
  );
}
