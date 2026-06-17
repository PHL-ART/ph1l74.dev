'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ErrorState {
  title?: string;
  message?: string;
}

interface ErrorContextType {
  error: ErrorState | null;
  isError: boolean;
  setError: (error: ErrorState | null) => void;
  clearError: () => void;
  handleDatabaseError: (error: unknown) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<ErrorState | null>(null);

  const clearError = () => setError(null);

  const handleDatabaseError = (err: unknown) => {
    console.error('Database error:', err);
    setError({
      title: 'Database Error',
      message: err instanceof Error ? err.message : 'An unexpected error occurred',
    });
  };

  return (
    <ErrorContext.Provider
      value={{
        error,
        isError: !!error,
        setError,
        clearError,
        handleDatabaseError,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useErrorHandler must be used within an ErrorProvider');
  }
  return context;
};
