import 'prismjs/components/prism-core';

import Highlight, { Language, defaultProps } from 'prism-react-renderer';

import okaidia from 'prism-react-renderer/themes/okaidia';

type Props = {
  content: string;
  language: string;
};

function Code({ content, language }: Props) {
  return (
    <Highlight
      {...defaultProps}
      code={content}
      language={language as Language}
      theme={okaidia}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className + ' !text-sm !bg-slate-800 !p-0'}
          style={style}
        >
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

export default Code;
