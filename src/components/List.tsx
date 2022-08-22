type Props = {
  children: React.ReactNode;
  ordered: boolean;
};

function List({ children, ordered }: Props) {
  if (ordered) {
    return <ol>{children}</ol>;
  } else {
    return <ul className="list-disc list-inside">{children}</ul>;
  }
}

export default List;
