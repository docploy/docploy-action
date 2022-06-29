type Props = {
  children: React.ReactNode;
};

function Blockquote({ children }: Props) {
  return (
    <blockquote className="font-medium italic leading-loose m-8 text-slate-400 text-2xl">
      {children}
    </blockquote>
  );
}

export default Blockquote;
