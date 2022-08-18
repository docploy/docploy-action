import Code from 'src/components/Code';

type Props = {
  content: string;
  language: string;
};

function Fence({ content, language }: Props) {
  return (
    <div className="bg-slate-800 my-4 px-8 pb-8 pt-4 relative rounded-lg">
      <Code content={content} language={language} />
    </div>
  );
}

export default Fence;
