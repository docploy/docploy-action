import 'prismjs/themes/prism-okaidia.css';
import 'prismjs';

import Prism from 'react-prism';

type Props = {
  children: React.ReactNode;
  language: string;
};

function Fence({ children, language }: Props) {
  return (
    <Prism
      key={language}
      component="pre"
      className={`language-${language} rounded-md`}
    >
      {children}
    </Prism>
  );
}

export default Fence;
