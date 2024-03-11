
'use client';
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"

import {  useActions, useUIState } from 'ai/rsc';

import type { AI } from '../../app/action';
import { UserMessage } from "./message";
import { Button } from "../ui/button";

export function ShowAnswer({ icon = 'check', text= 'Correct Answer'}) {
  const { submitUserMessage } = useActions<typeof AI>();
  const [, setMessages] = useUIState<typeof AI>();

  // @ts-ignore
function CheckCircleIcon(props) {
  return (
    <svg
    {...props}
    className="w-8 h-8 text-green-500"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

// @ts-ignore
function XCircleIcon(props) {
  return (
    <svg
      {...props}
      className="w-8 h-8 text-red-500"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  )
}
  // A function to select the icon component based on a prop
  const IconSelector = ({ iconName }: { iconName: string }) => {
    const icons = {
      check: CheckCircleIcon,
      exclamation: XCircleIcon,
      // Add other icons you might use
    };

    // @ts-ignore
    const SelectedIcon = icons[iconName] || CheckCircleIcon; // Fallback to CheckCircleIcon if iconName doesn't match
    return <SelectedIcon className="w-8 h-8" />;
  };


  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-4">
        <IconSelector iconName={icon} />
        <CardTitle>Correct Answer</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="mt-6">
          <p className="mt-1">{text}</p>
        </div>

        <Button
          className="ml-1 text-center shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear"
          onClick={async (e) => {
            e.preventDefault();
            // Add user message UI
            setMessages((currentMessages: any) => [
              ...currentMessages,
              {
                id: Date.now(),
                display: <UserMessage>
                  {`Next question`}
                </UserMessage>,
              },
            ]);
            const response = await submitUserMessage('Next question');
            // Insert a new system message to the UI.
            setMessages((currentMessages: any) => [
              ...currentMessages,
              response,
            ]);
          }}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
}
