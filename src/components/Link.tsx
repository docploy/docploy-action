import NextLink from 'next/link';

type Props = {
  children: React.ReactNode;
  href: string;
  title: string;
};

function Link({ children, href, title }: Props) {
  return (
    <NextLink href={href}>
      <a
        title={title}
        className="decoration-sky-400 font-semibold text-lg text-sky-500 underline"
      >
        {children}
      </a>
    </NextLink>
  );
}

export default Link;
