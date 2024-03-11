import { Button } from '@/components/ui/button';
import { ExternalLink } from '@/components/external-link';
import { IconArrowRight } from '@/components/ui/icons';
import  {subjects} from './quiz/topics';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomElements(arr: any[], count: any) {
  return arr.filter((item) => ['reactjs', 'javascript', 'python'].includes(item.topic))
}

function generateMessage(topic: string) {
  const sentenceVariants = [
    `Start a quiz on ${capitalizeFirstLetter(topic)}`,
  ];

  // Select a random sentence variant
  const randomIndex = Math.floor(Math.random() * sentenceVariants.length);
  return sentenceVariants[randomIndex];
}


export function EmptyScreen({
  submitMessage,
}: {
  submitMessage: (message: string) => void;
}) {
  // const exampleMessages = getRandomElements(subjects, 3).map((subject) => {
  //   const message = generateMessage(subject.topic);
  //   return {
  //     heading: message,
  //     message: message,
  //   };
  // });
  const exampleMessages = [
    {
      heading: 'Start a quiz on Reactjs by @ebazhanov',
      message: 'Start a quiz on reactjs',
    },
    {
      heading: `Start a quiz on Javascript by @lydiahallie`,
      message: 'Start a quiz on javascript',
    },
    {
      heading: 'Start a quiz on Python by @ebazhanov',
      message: 'Start a quiz on python',
    },
  ];
  return (
    <div className="mx-auto max-w-2xl px-4">
  <div className="rounded-lg border bg-background p-8 mb-4">
    <h1 className="mb-2 text-lg font-semibold">
      Welcome to the Interactive Quiz Challenge!
    </h1>
    <p className="mb-2 leading-normal text-muted-foreground">
      This is a demo of an interactive quiz assistant that can generate quizzes on various topics, assess your answers, and provide instant feedback.
    </p>
    <p className="mb-2 leading-normal text-muted-foreground">
      The quiz is powered by an advanced AI model, designed to offer a fun and educational experience.
    </p>
    <p className="mb-2 leading-normal text-muted-foreground">
      Engage with a wide range of topics and challenge your knowledge. Our AI will track your progress and help you improve.
    </p>
    <p className="leading-normal text-muted-foreground">Try starting with a sample question:</p>
    <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
      {exampleMessages.map((message, index) => (
        <Button
          key={index}
          variant="link"
          className="h-auto p-0 text-base"
          onClick={async () => {
            submitMessage(message.message);
          }}
        >
          <IconArrowRight className="mr-2 text-muted-foreground" />
          {message.heading}
        </Button>
      ))}
    </div>
  </div>
  <p className="leading-normal text-muted-foreground text-[0.8rem] text-center max-w-96 ml-auto mr-auto">
    Explore various topics and enhance your knowledge across different fields with our interactive quiz.
  </p>
</div>

  );
}
