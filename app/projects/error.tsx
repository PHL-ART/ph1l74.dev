'use client';

import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Компонент для обработки ошибок на странице проектов
 */
export default function ProjectsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Можно добавить логирование ошибок
    console.error('Ошибка на странице проектов:', error);
  }, [error]);

  // Определяем тип ошибки и выводим соответствующее сообщение
  let title = 'Произошла ошибка';
  let message = 'К сожалению, не удалось загрузить проекты. Пожалуйста, попробуйте позже.';

  if (error.message.includes("Can't reach database server")) {
    title = 'Нет соединения с базой данных';
    message = 'К сожалению, не удалось получить список проектов из-за проблем с подключением к базе данных.';
  }

  return (
    <div className="flex flex-col gap-40">
      <div className="flex flex-row basis-full items-center gap-10">
        <div className="grow shrink basis-0 flex justify-center font-bold text-6xl ">
          Projects
        </div>
        <div className="grow shrink basis-0">
          <ErrorMessage
            title={title}
            message={message}
            onRetry={reset}
          />
        </div>
      </div>
    </div>
  );
}