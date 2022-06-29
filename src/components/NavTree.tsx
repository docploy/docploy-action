import Link from 'next/link';
import { useRouter } from 'next/router';

function NavTree({ navData }) {
  const router = useRouter();
  const { children: sections } = navData;

  return (
    <div className="mb-16">
      {sections.map((section) => {
        return (
          <div key={section.token} className="mb-8">
            <h5 className="font-bold mb-2 mt-2 text-sm">{section.name}</h5>
            <ul className="space-y-2">
              {section.children.map((page) => {
                let linkClasses = 'hover:text-slate-500 text-slate-800';
                if (router.asPath == page.path) {
                  linkClasses = 'font-bold text-sky-500';
                }
                return (
                  <li key={page.token}>
                    <Link href={page.path}>
                      <a className={linkClasses}>{page.name}</a>
                    </Link>
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
