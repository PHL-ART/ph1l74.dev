'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Типы ошибок, которые могут возникнуть в приложении
export enum ErrorType {
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  UNKNOWN = 'UNKNOWN',
}

// Интерфейс для объекта ошибки
export interface AppError {
  type: ErrorType;
  message: string;
  title?: string;
  originalError?: Error;
  timestamp: Date;
}

// Интерфейс для контекста ошибок
interface ErrorContextType {
  error: AppError | null;
  setError: (error: AppError | null) => void;
  clearError: () => void;
  handleError: (error: Error | unknown, type?: ErrorType) => void;
  isError: boolean;
}

// Создаем контекст с начальным значением
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Хук для использования контекста ошибок
export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  return context;
};

// Провайдер контекста ошибок
interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setErrorState] = useState<AppError | null>(null);

  // Функция для установки ошибки
  const setError = useCallback((newError: AppError | null) => {
    setErrorState(newError);
    
    // Если нужно, здесь можно добавить логирование ошибок
    if (newError) {
      console.error('Error occurred:', newError);
    }
  }, []);

  // Функция для очистки ошибки
  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  // Функция для обработки ошибок
  const handleError = useCallback((err: Error | unknown, type: ErrorType = ErrorType.UNKNOWN) => {
    const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
    
    let errorTitle = 'Ошибка';
    
    // Определяем заголовок в зависимости от типа ошибки
    switch (type) {
      case ErrorType.DATABASE:
        errorTitle = 'Ошибка базы данных';
        break;
      case ErrorType.NETWORK:
        errorTitle = 'Ошибка сети';
        break;
      case ErrorType.AUTHENTICATION:
        errorTitle = 'Ошибка аутентификации';
        break;
      default:
        errorTitle = 'Неизвестная ошибка';
    }
    
    setError({
      type,
      message: errorMessage,
      title: errorTitle,
      originalError: err instanceof Error ? err : undefined,
      timestamp: new Date(),
    });
  }, [setError]);

  // Проверка наличия ошибки
  const isError = error !== null;

  // Значение контекста
  const value = {
    error,
    setError,
    clearError,
    handleError,
    isError,
  };

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
};

// Хук для обработки ошибок в компонентах
export const useErrorHandler = () => {
  const { handleError } = useErrorContext();
  
  return {
    handleError,
    handleDatabaseError: (error: Error | unknown) => handleError(error, ErrorType.DATABASE),
    handleNetworkError: (error: Error | unknown) => handleError(error, ErrorType.NETWORK),
    handleAuthError: (error: Error | unknown) => handleError(error, ErrorType.AUTHENTICATION),
  };
};