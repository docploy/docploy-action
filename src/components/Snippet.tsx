import 'prismjs/themes/prism-okaidia.css';

import Prism from 'react-prism';
import prismjs from 'prismjs';

type Props = {
  children: React.ReactNode;
  language: string;
};

function Snippet({ children, language }: Props) {
  const html = prismjs.highlight(
    children,
    prismjs.languages[language],
    language
  );
  return (
    <pre
      className={`language-${language} rounded-md`}
      dangerouslySetInnerHTML={{ __html: html }}
    ></pre>
  );
}

export default Snippet;
