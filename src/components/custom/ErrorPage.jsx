import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
        Oops! Something went wrong.
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        We're sorry, but an unexpected error occurred. Please try refreshing the page or head back to the home page.
      </p>
      {error && (
        <pre className="bg-muted p-4 rounded-lg text-sm text-left mb-8 max-w-full overflow-auto">
          <code>{error.statusText || error.message}</code>
        </pre>
      )}
      <div className="flex gap-4">
        <Button onClick={() => navigate('/')} variant="default">
          Go Home
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    </div>
  );
}
