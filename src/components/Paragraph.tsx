type Props = {
  children: React.ReactNode;
};

function Paragraph({ children }: Props) {
  return <p className="leading-relaxed mb-8 text-md">{children}</p>;
}

export default Paragraph;
