import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-python';

import { ClipboardCheckIcon, ClipboardIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';

import prismjs from 'prismjs';

type Snippet = {
  language: string;
  content: string;
};

type Props = {
  snippets: Snippet[];
};

function Snippet({ snippets }: Props) {
  const languages = snippets.map((snippet) => snippet.language);

  const [snippetIndex, setSnippetIndex] = useState(0);
  const [currentCode, setCode] = useState('');
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const currentSnippet = snippets[snippetIndex];
    let code = '';
    if (currentSnippet) {
      const { content, language } = currentSnippet;
      const lowerCaseLanguage = language.toLowerCase();
      code = prismjs.highlight(
        content,
        prismjs.languages[lowerCaseLanguage],
        lowerCaseLanguage
      );
    }
    setCode(code);
  }, [snippetIndex]);
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
      <pre
        className={`language-${snippets[snippetIndex].language} rounded-md !text-sm !bg-slate-800 !p-0`}
        dangerouslySetInnerHTML={{ __html: currentCode }}
      ></pre>
    </div>
  );
}

export default Snippet;
