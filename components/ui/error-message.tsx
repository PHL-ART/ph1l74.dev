'use client';

import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  retry?: () => void;
}

/**
 * Компонент для отображения сообщений об ошибках
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Произошла ошибка',
  message = 'К сожалению, не удалось загрузить данные. Пожалуйста, попробуйте позже.',
  retry
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl font-medium text-red-500">
        {title}
      </div>
      <div className="text-lg">
        {message}
      </div>
      {retry && (
        <button 
          onClick={retry}
          className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 w-fit"
        >
          Попробовать снова
        </button>
      )}
    </div>
  );
};