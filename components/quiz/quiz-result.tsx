import React from 'react';
import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// @ts-ignore
export function QuizResult({ totalQuestions, correctAnswers, incorrectAnswers, unansweredQuestions = 0 }) {
  // Calculate the percentage of correct answers
  const correctPercentage = Math.round((correctAnswers / totalQuestions) * 100);
  const resultMessage = `You answered ${correctAnswers} out of ${totalQuestions} questions correctly.`;

  // Optional: Additional messages based on the performance could be determined here
  let performanceMessage = "Great job! You're on your way to becoming a quiz master.";
  if (correctPercentage < 50) {
    performanceMessage = "Good effort! Practice more to improve your score.";
  } else if (correctPercentage >= 50 && correctPercentage < 75) {
    performanceMessage = "Well done! You're getting there.";
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Quiz Result</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="text-4xl font-bold">{`${correctPercentage}%`}</div>
        <div className="text-gray-500 dark:text-gray-400">{resultMessage}</div>
        <div className="text-lg font-medium text-center">{performanceMessage}</div>
        {unansweredQuestions > 0 && (
          <div className="text-sm text-red-500">Note: You left {unansweredQuestions} questions unanswered.</div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {/* Assuming the Button component can handle an onClick event for retry logic */}
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </CardFooter>
    </Card>
  );
}
