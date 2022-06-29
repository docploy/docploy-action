type Props = {
  children: React.ReactNode;
};

function Paragraph({ children }: Props) {
  return <p className="leading-loose mb-4 mt-4 text-lg">{children}</p>;
}

export default Paragraph;
