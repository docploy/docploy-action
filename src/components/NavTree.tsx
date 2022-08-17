import Link from 'next/link';
import { useRouter } from 'next/router';
import { type NavTreeType } from 'src/types';

function isSelected(asPath: string, relPath: string) {
  return (
    asPath.length >= relPath.length && asPath.slice(-relPath.length) === relPath
  );
}

function PrimaryChildLabel({
  type,
  name,
  path,
  isSelected,
}: NavTreeType & { isSelected: boolean }) {
  if (type === 'directory') {
    return <h5 className="font-bold mb-2 mt-2 text-md">{name}</h5>;
  }

  if (type === 'file') {
    let linkClasses = 'hover:text-slate-500 text-slate-800';

    if (isSelected) {
      linkClasses = 'font-bold text-sky-500';
    }
    return (
      <Link href={path}>
        <a className={linkClasses}>{name}</a>
      </Link>
    );
  }

  return null;
}

function SecondaryChildLabel({
  type,
  name,
  path,
  isSelected,
}: NavTreeType & { isSelected: boolean }) {
  if (type === 'directory') {
    return (
      <h6 className="font-bold mb-2 mt-2 text-neutral-500 text-sm uppercase">
        {name}
      </h6>
    );
  }

  if (type === 'file') {
    let linkClasses = 'hover:text-slate-500 text-slate-800';

    if (isSelected) {
      linkClasses = 'font-bold text-sky-500';
    }
    return (
      <Link href={path}>
        <a className={linkClasses}>{name}</a>
      </Link>
    );
  }

  return null;
}

function TertiaryChildLabel({
  type,
  name,
  path,
  isSelected,
}: NavTreeType & { isSelected: boolean }) {
  if (type === 'file') {
    let linkClasses = 'hover:text-slate-500 pl-4 text-slate-800';

    if (isSelected) {
      linkClasses = 'font-bold pl-4 text-sky-500';
    }
    return (
      <Link href={path}>
        <a className={linkClasses}>{name}</a>
      </Link>
    );
  }

  return null;
}

function NavTree({ navData }: { navData: NavTreeType }) {
  const router = useRouter();
  const asPath = router.asPath;
  const { children: primaryChildren } = navData;

  return (
    <div className="mb-16">
      {primaryChildren.map((primaryChild) => {
        return (
          <div key={primaryChild.token} className="mb-8">
            <PrimaryChildLabel
              {...primaryChild}
              isSelected={isSelected(asPath, primaryChild.relPath)}
            />
            <ul className="space-y-2">
              {primaryChild.children.map((secondaryChild) => {
                return (
                  <li key={secondaryChild.token}>
                    <SecondaryChildLabel
                      {...secondaryChild}
                      isSelected={isSelected(asPath, secondaryChild.relPath)}
                    />
                    <ul>
                      {secondaryChild.children.map((tertiaryChild) => {
                        return (
                          <li key={tertiaryChild.token}>
                            <TertiaryChildLabel
                              {...tertiaryChild}
                              isSelected={isSelected(
                                asPath,
                                tertiaryChild.relPath
                              )}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default NavTree;
