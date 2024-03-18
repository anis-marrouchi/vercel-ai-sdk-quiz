import 'server-only';

import { createAI, getMutableAIState, render } from 'ai/rsc';
import OpenAI from 'openai';

import {
  spinner,
  BotCard,
  BotMessage
} from '@/components/quiz';
import { subjects } from '@/components/quiz/topics';

import { z } from 'zod';
import { QuizStartSkeleton } from '@/components/quiz/quiz-start-skeleton';
import { QuizStart, QuizQuestion, QuizResult } from '@/components/quiz';
import { QuizQuestionSkeleton } from '@/components/quiz/quiz-question-skeleton';
import { QuizResultSkeleton } from '@/components/quiz/quiz-result-skeleton';
import { ShowAnswer } from '@/components/quiz/show-answer';
import { ShowAnswerSkeleton } from '@/components/quiz/show-answer-skeleton';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});



async function startQuiz(topics: string, numberOfQuestions: number, showCorrectAnswer: boolean) {
  'use server';
  // Get the topic url from the topics
  let subject = subjects.find((subject) => subject.topic === topics);
  if (!subject) {
    let randomIndex = Math.floor(Math.random() * subjects.length);
    subject = subjects[randomIndex];
  }
  const res = await fetch(subject.url)
  const markdown = await res.text()
  const content = `Create a quiz with ${numberOfQuestions} questions based on the following "Markdown content". Show correct answer after user submits answer: if ${showCorrectAnswer}\n\n

  **Markdown Content**:\n\n
  """${markdown}"""
  \n\n
  **Note**: The user is not aware of the content of the Markdown. The quiz should be generated based on the content provided. Any references to the content should be included in the quiz questions and answers to ensure a comprehensive review and learning experience.
  Always randomly generate a question from the content and display it to the user using the call function.\n
  Prepend the image with the base url as follow: ![image]([base url of ${subject.url}]/[relative path to image])
  Always include code snippets if found in the MD.\n
  **Instructions**:\n\n
  Include any relevant details from the content in the quiz questions and answers. Ensure that the quiz is engaging and educational, providing immediate feedback to the user's responses.
  \n\n
  Send one question at a time to the user. Strictly call the function quiz_question(question, questionType, possibleAnswers, showAnswer, answer, explanation, source) to display the question. 

  Given Markdown content that is well-organized and contains distinct sections, create a dynamic and engaging quiz. Each quiz question should be generated based on the key points or topics covered in each section of the Markdown. The goal is to comprehensively test the user's understanding of the entire content, providing a mix of question types (e.g., multiple-choice, true/false, fill-in-the-blank) for variety. After the user submits an answer, the correct answer should be displayed along with an explanation to reinforce learning. To implement this, use the \`quiz_question\` function following this structure:

  1. **Analyze the Markdown Content**: Break down the content into its distinct sections or key points. Each section should serve as the basis for one or more questions in the quiz.
  
  2. **Formulate Questions**: For every section or key point identified, create questions that challenge the user's comprehension or application of the content. Ensure that the questions span the variety of formats for engagement and comprehensive assessment.
  
  3. **Determine Correct Answers and Explanations**: Identify the correct answer for each question and provide a concise explanation. This explanation should ideally reference the specific part of the content that justifies the answer, enhancing the educational value of the quiz.
  
  4. **Implement the \`quiz_question\` Function**:
  - \`question\`: Craft a clear and concise question text.
  - \`questionType\`: Specify the type of question (e.g., "multiple-choice").
  - \`possibleAnswers\`: List the options for multiple-choice questions or the expected keywords for open-ended questions.
  - \`showAnswer\`: Set to \`true\` to show the correct answer after the user's submission.
  - \`answer\`: Provide the correct answer.
  - \`explanation\`: Offer a brief explanation for why this is the correct answer, linking back to the content.
  - \`source\`: Optionally, include a reference to the specific section of the Markdown content that the question is based on.
  
  5. **Facilitate User Interaction and Feedback**: Present the questions one at a time, using the user's response to each question as an opportunity to offer immediate feedback through the correct answer and its explanation. Continue this process until questions have been asked for all sections of the content, ensuring a comprehensive review and learning experience.
  
  This structured approach to quiz generation not only tests knowledge but also reinforces learning through immediate feedback, making it an effective educational tool.
      `;

  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: 'system',
      content,
    },
  ]);

  const response = await submitUserMessage(`Create a quiz on ${topics} with ${numberOfQuestions} questions. Show correct answer after user submits answer: ${showCorrectAnswer}`);



  return {
    startQuizUI: true,
    newMessage: response,
  };
}

async function submitAnswer(answer: string) {
  'use server';

  const response = await submitUserMessage(`${answer}`);


  return {
    answerUI: true,
    newMessage: response,
  };
}


async function submitUserMessage(content: string) {
  'use server';
  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: 'user',
      content,
    },
  ]);


  const ui = render({
    provider: openai,
    model: 'gpt-4-0125-preview',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `[\
        You are an AI chatbot designed to generate advanced certificate exam preparation on a chosen topic based on the provided content.\n\
        1. **\`start_quiz\` Starting the Quiz**: Once the user is ready to start the quiz, call \`start_quiz(topic, numberOfQuestions)\` to confirm the topic and the number of questions. This step should only be done once per quiz session to initialize the quiz. You will receive a response with the quiz content details to be used in the subsequent steps.\n\
        \n\
        2. **\`quiz_question\` Render a Question**: After initializing the quiz, automatically proceed to display one question at a time. For each question, call \`quiz_question(question, questionType, possibleAnswers, showAnswer, answer, explanation, source)\` with the necessary details from the provided content. The following details are required for each question:\n\
          - \`question\`: The text of the quiz question along the code if applicable.\n\
          - \`questionType\`: \"multiple-choice\", \"single-choice\", or \"boolean\".\n\
          - \`possibleAnswers\`: An array of possible answers.\n\
          - \`showAnswer\`: Whether to show the correct answer and explanation after answering.\n\
          - \`answer\`: The correct answer (if \`showAnswer\` is true).\n\
          - \`explanation\`: Explanation for the correct answer (if \`showAnswer\` is true).\n\
          - \`source\`: Source of the correct answer (optional, if \`showAnswer\` is true).\n\
        \n\
        Ensure to dynamically adjust the call to \`quiz_question\` based on the user's progression through the quiz, avoiding repetitive or unnecessary prompts to start the quiz after it has already begun.\n\
        \n\
        3. **\`show_answer\` Show Correct Answer Details**: This function should be called to reveal the answer details, including the correct answer, explanation, and source, immediately after the user submits their response and chooses to see the answer. It serves as an essential tool for providing instant feedback and learning reinforcement, complementing the \`quiz_question\` function. Ensure that \`show_answer\` is invoked conditionally, based on the user's preference or action that indicates they wish to view the answer details right after responding to a question.
        - \`icon\`: The icon to display, either "check" for a correct answer or "exclamation" for further attention.
        - \`text\`: The text explaining why this is the correct answer or providing additional information.
        \n\
        4. **\`display_result\` Completing the Quiz**: Upon the user answering all questions or when the quiz reaches its end, call \`display_result(totalQuestions, correctAnswers, incorrectAnswers, unansweredQuestions)\` to display the user's performance metrics.\n\
        \n\
        Your interaction with the user is strictly limited through the use of the provided functions. You should not prompt the user for input or display any messages outside of the provided functions. Ensure that the quiz is engaging and educational, providing immediate feedback to the user's responses. Throughout the quiz, track the user's progress, including attempted questions and their answers, providing feedback as appropriate. Ensure a seamless and engaging quiz experience by dynamically responding to the user's actions without redundant prompts."
        ]`,
      },
      ...aiState.get().map((info: any) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
    initial: <BotMessage className="items-center">{spinner}</BotMessage>,
    // @ts-ignore
    text: ({content, done}) => {
      if (done) {
        aiState.done([...aiState.get(), { role: 'assistant', content }]);
      }
      return <BotMessage>{content}</BotMessage>;
    },
    tools: {
      start_quiz: {
        description: 'Initialize the quiz with a specified topic and number of questions.',
        parameters: z.object({
          topics: z.string().optional().default('reactjs')
            .describe('The topics of the quiz, e.g. "reactjs", "nextjs".'),
          numberOfQuestions: z.number().optional()
            .describe('The total number of questions to include in the quiz.'),
        }).required(),
        /// @ts-ignore
        render: async function* ({ topics, numberOfQuestions }) {
          
          yield <BotCard>
            <QuizStartSkeleton />
          </BotCard>
          // Update the AI state with details about the quiz that's starting
          aiState.done([
            ...aiState.get(),
            {
              role: 'function',
              name: 'start_quiz',
              content: JSON.stringify({ topics, numberOfQuestions }),
            },
          ]);

          return <BotCard>
            {/* @ts-ignore */}
            <QuizStart topics={topics} numberOfQuestions={numberOfQuestions} />
          </BotCard>
        }
      },
      quiz_question: {
        description: 'Display a quiz question, including its type and possible answers, and manage user interactions.',
        parameters: z.object({
          question: z.string().describe('The content of the question to display.'),
          questionType: z.enum(['multiple-choice', 'single-choice', 'boolean'])
            .describe('The type of the question.'),
          possibleAnswers: z.array(z.string())
            .describe('An array of possible answers for the question.'),
          showAnswer: z.boolean().optional()
            .describe('Whether to immediately show the correct answer and explanation.'),
          answer: z.string().optional()
            .describe('The correct answer to the question.'),
          explanation: z.string().optional()
            .describe('A detailed explanation of the correct answer.'),
          source: z.string().optional()
            .describe('The source or reference for the correct answer.'),
        }).required(),
        /// @ts-ignore
        render: async function* ({ question, questionType, possibleAnswers, showAnswer, answer, source, explanation }) {
          
          // Preliminary UI feedback to indicate a question is being prepared
          yield <BotCard>
            <QuizQuestionSkeleton />
          </BotCard>;

          // Update the AI state with the current question details
          aiState.done([
            ...aiState.get(),
            {
              role: 'function',
              name: 'quiz_question',
              content: JSON.stringify({ question, questionType, possibleAnswers }),
            },
          ]);
          // Update the UI with the current question
          return <BotCard>
            {/* @ts-ignore */}
            <QuizQuestion question={question} questionType={questionType} possibleAnswers={possibleAnswers} answer={answer} showAnswer={showAnswer} source={source} explanation={explanation} />
          </BotCard>;

        }
      },
      show_answer: {
        description: 'Show the correct answer after each question when requested with an optional icon and customizable text.',
        parameters: z.object({
          icon: z.enum(['check', 'exclamation']).optional().default('check')
            .describe('The icon to display, either "check" for a correct answer or "exclamation" for further attention.'),
          text: z.string().optional().default('This is the correct answer')
            .describe('The text explaining why this is the correct answer or providing additional information.'),
        }),
        /// @ts-ignore
        render: async function* ({ icon, text }) {
          // Display a skeleton to indicate that the answer is being prepared
          
          yield <BotCard>
            {/* Assuming you have an AnswerSkeleton component for this purpose */}
            <ShowAnswerSkeleton />
          </BotCard>

          // Update the UI with the answer details
          // Optionally update the AI state if you need to track that the answer was shown
          aiState.done([
            ...aiState.get(),
            {
              role: 'function',
              name: 'show_answer',
              content: JSON.stringify({ icon, text }),
            },
          ]);

          return <BotCard>
            {/* @ts-ignore */}
            <ShowAnswer icon={icon} text={text} />
          </BotCard>

        }
      },
      display_result: {
        description: 'Display the user’s overall performance upon completing the quiz.',
        parameters: z.object({
          totalQuestions: z.number().describe('The total number of questions the user attempted.'),
          correctAnswers: z.number().describe('The number of questions the user answered correctly.'),
          incorrectAnswers: z.number().describe('The number of questions the user answered incorrectly.'),
          unansweredQuestions: z.number().optional().describe('The number of questions the user did not answer, if any.'),
        }).required(),
        /// @ts-ignore
        render: async function* ({ totalQuestions, correctAnswers, incorrectAnswers, unansweredQuestions }) {
          
          // Preliminary UI feedback to indicate results are being compiled
          yield <BotCard>
            <QuizResultSkeleton />
          </BotCard>;

          // Update the AI state with the quiz result details
          aiState.done([
            ...aiState.get(),
            {
              role: 'function',
              name: 'display_result',
              content: JSON.stringify({ totalQuestions, correctAnswers, incorrectAnswers, unansweredQuestions }),
            },
          ]);

          // Update the UI with the quiz results
          return <BotCard>
            {/* @ts-ignore */}
            <QuizResult totalQuestions={totalQuestions} correctAnswers={correctAnswers} incorrectAnswers={incorrectAnswers} unansweredQuestions={unansweredQuestions} />
          </BotCard>;

        }
      }
    }
  });

  return {
    id: Date.now(),
    display: ui,
  };
}

// Define necessary types and create the AI.

const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI: any = createAI({
  actions: {
    submitUserMessage,
    startQuiz,
    submitAnswer,
  },
  initialUIState,
  initialAIState,
});
