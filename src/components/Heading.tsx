type Props = {
  level: number;
  children: React.ReactNode;
};

function switchHeading(props: Props) {
  const { children, level } = props;
  switch (level) {
    case 1:
      return <h1 className="font-bold mt-24 text-6xl">{children}</h1>;
    case 2:
      return <h2 className="font-bold mt-24 text-2xl">{children}</h2>;
    case 3:
      return <h3 className="mt-4 text-slate-500 text-xl">{children}</h3>;
  }
}

function Heading(props: Props) {
  return switchHeading(props);
}

export default Heading;
