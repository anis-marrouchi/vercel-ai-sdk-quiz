// Assuming use of a Next.js project
'use client';

import dynamic from 'next/dynamic';
import { QuizStartSkeleton } from './quiz-start-skeleton';
import { QuizQuestionSkeleton } from './quiz-question-skeleton';
import { QuizResultSkeleton } from './quiz-result-skeleton';

export { spinner } from './spinner';
export { BotCard, BotMessage, SystemMessage } from './message';

const QuizStart = dynamic(() => import('./quiz-start').then(mod => mod.QuizStart), {
  ssr: false,
  loading: () => <QuizStartSkeleton />,
});

const QuizQuestion = dynamic(
  () => import('./quiz-question').then(mod => mod.QuizQuestion),
  {
    ssr: false,
    loading: () => <QuizQuestionSkeleton />,
  },
);

const QuizResult = dynamic(() => import('./quiz-result').then(mod => mod.QuizResult), {
  ssr: false,
  loading: () => <QuizResultSkeleton />,
});

export { QuizStart, QuizQuestion, QuizResult };
