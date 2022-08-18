import 'prismjs/themes/prism-okaidia.css';

import {
  CheckCircleIcon,
  ClipboardCheckIcon,
  ClipboardIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from '@heroicons/react/outline';
import React, { useState } from 'react';

import Code from 'src/components/Code';
import { TestStatus } from 'src/types';
import Tippy from '@tippyjs/react';
import { format } from 'date-fns';

type Snippet = {
  language: string;
  content: string;
  status: TestStatus;
  runTime: number;
};

type Props = {
  snippets: Snippet[];
};

type SnippetStatus = {
  status: TestStatus;
  runTime: number;
};

type SnippetStatusTooltipProps = {
  children: React.ReactElement;
  message: string;
};

function SnippetStatusTooltip({
  children,
  message,
}: SnippetStatusTooltipProps) {
  return (
    <Tippy
      placement="top"
      content={
        <div className="bg-slate-900 text-white font-bold p-2 rounded-md text-xs">
          {message}
        </div>
      }
    >
      {children}
    </Tippy>
  );
}

function SnippetStatus({ status, runTime }: SnippetStatus) {
  const parsedTime = format(runTime, 'MM/dd/yyyy');
  switch (status) {
    case 'passed':
      return (
        <SnippetStatusTooltip message={`Last run passed on ${parsedTime}`}>
          <CheckCircleIcon className="absolute text-green-400 h-6 w-6 bottom-4 right-4" />
        </SnippetStatusTooltip>
      );
    case 'failed':
      return (
        <SnippetStatusTooltip message={`Last run failed on ${parsedTime}`}>
          <XCircleIcon className="absolute text-red-400 h-6 w-6 bottom-4 right-4" />
        </SnippetStatusTooltip>
      );
    case 'unknown':
      return (
        <SnippetStatusTooltip message="This code has not been validated">
          <QuestionMarkCircleIcon className="absolute text-yellow-400 h-6 w-6 bottom-4 right-4" />
        </SnippetStatusTooltip>
      );
  }
}

function Snippet({ snippets }: Props) {
  const languages = snippets.map((snippet) => snippet.language);

  const [snippetIndex, setSnippetIndex] = useState(0);
  const [hasCopied, setHasCopied] = useState(false);

  const buttonClass = 'cursor-pointer font-bold p-2 text-sm text-slate-200';
  const selectedButtonClass = buttonClass + ' bg-slate-600 rounded-md';

  const onCopy = async () => {
    await navigator.clipboard.writeText(snippets[snippetIndex].content);
    setHasCopied(true);
  };

  const onLanguageClick = (i: number) => {
    setSnippetIndex(i);
    setHasCopied(false);
  };

  return (
    <div className="bg-slate-800 my-4 px-8 pb-8 pt-4 relative rounded-lg">
      <ul className="flex mb-6 gap-2 items-baseline">
        {languages.map((language: string, i: number) => {
          return (
            <li key={language}>
              <button
                role="tab"
                aria-selected={i === snippetIndex}
                onClick={() => onLanguageClick(i)}
                className={
                  i === snippetIndex ? selectedButtonClass : buttonClass
                }
              >
                {language}
              </button>
            </li>
          );
        })}
      </ul>
      {hasCopied ? (
        <ClipboardCheckIcon
          onClick={onCopy}
          className="absolute cursor-pointer text-green-400 h-6 w-6 top-4 right-4"
        />
      ) : (
        <ClipboardIcon
          onClick={onCopy}
          className="absolute cursor-pointer text-slate-500 h-6 w-6 top-4 right-4"
        />
      )}
      <Code
        content={snippets[snippetIndex].content}
        language={snippets[snippetIndex].language?.toLowerCase()}
      />
      <SnippetStatus
        status={snippets[snippetIndex].status}
        runTime={snippets[snippetIndex].runTime}
      />
    </div>
  );
}

export default Snippet;
