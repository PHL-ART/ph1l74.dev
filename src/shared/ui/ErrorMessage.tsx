import { FC } from 'react';

interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ title, message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-bold text-red-400 mb-2">{title}</h2>
        <p className="text-gray-300 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            Попробовать снова
          </button>
        )}
      </div>
    </div>
  );
};
