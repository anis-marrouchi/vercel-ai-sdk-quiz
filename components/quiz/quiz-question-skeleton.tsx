/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ddQ4NvreMoe
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Skeleton } from "@/components/ui/skeleton"

export  function QuizQuestionSkeleton() {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        <Skeleton className="h-6 w-full" />
      </h2>
      <div className="mb-2">
        <pre className="bg-gray-100 p-3 rounded">
          <Skeleton className="h-24 w-full" />
        </pre>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-full ml-2" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-full ml-2" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-full ml-2" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-full ml-2" />
        </div>
      </div>
      <div className="mt-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full mt-1" />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">
          <Skeleton className="h-6 w-full" />
        </h3>
        <Skeleton className="h-4 w-full mt-1" />
      </div>
    </div>
  )
}

