import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-python';

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

  const [currentLanguage, setLanguage] = useState(languages[0]);
  const [currentCode, setCode] = useState('');

  useEffect(() => {
    const currentSnippet = snippets.find(
      (snippet) => snippet.language === currentLanguage
    );
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
  }, [currentLanguage]);
  const buttonClass = 'cursor-pointer font-bold p-2 text-sm text-slate-200';
  const selectedButtonClass = buttonClass + ' bg-slate-600 rounded-md';

  return (
    <div className="bg-slate-800 my-4 px-8 pb-8 pt-4 rounded-lg">
      <ul className="flex mb-6 gap-2 items-baseline">
        {languages.map((language: string) => {
          return (
            <li key={language}>
              <button
                role="tab"
                aria-selected={language === currentLanguage}
                onClick={() => setLanguage(language)}
                className={
                  language === currentLanguage
                    ? selectedButtonClass
                    : buttonClass
                }
              >
                {language}
              </button>
            </li>
          );
        })}
      </ul>
      <pre
        className={`language-${currentLanguage} rounded-md !text-sm !bg-slate-800 !p-0`}
        dangerouslySetInnerHTML={{ __html: currentCode }}
      ></pre>
    </div>
  );
}

export default Snippet;
