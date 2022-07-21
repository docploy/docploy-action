import { GetStaticPaths, GetStaticProps } from 'next';

import Markdoc from '@markdoc/markdoc';
import NavTree from 'src/components/NavTree';
import type { NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import components from 'src/components';
import config from 'src/schema';
import fs from 'fs';
import glob from 'glob-promise';
import path from 'path';
import { type NavTreeType } from '../src/types';
import capitalize from 'src/utils/capitalize';
import { getDocsDir } from 'src/utils/helpers';

type Props = {
  content: string;
  navData: NavTreeType;
};

interface Params extends ParsedUrlQuery {
  docPath: string;
  slug: string[];
}

function getSlugFromPath(relPath: string) {
  let slug = relPath.replace('.md', '').split('/');

  const filename = slug[slug.length - 1];

  // remove index and only keep the directory name
  if (filename === 'index') {
    slug.pop();
  }

  return slug;
}

function getTitleFromToken(str: string) {
  const split = str.split('-');
  const capitalizedSplit = split.map((word: string) => {
    return capitalize(word);
  });
  return capitalizedSplit.join(' ');
}

function getNavTreePath(slug: string[], level: number) {
  // We cannot destructure Next env vars because they are statically injected
  const fullBaseUrl = process.env.FULL_BASE_URL;

  const navTreePath = fullBaseUrl + '/' + slug.slice(0, level + 1).join('/');

  return navTreePath;
}

async function getNavData() {
  const baseDocsDir = getDocsDir();
  const docPaths = await glob(path.join(baseDocsDir, '**/*.md'));
  const navTree = {
    path: '/',
    token: '',
    name: '',
    children: [],
  };

  for (const docPath of docPaths) {
    const relPath = docPath.substring(baseDocsDir.length);
    const slug = getSlugFromPath(relPath);

    // Start at the root
    let currentBranch: NavTreeType = navTree;

    slug.forEach((token, i) => {
      const match = currentBranch.children.find((node: any) => {
        return node.token === token;
      });

      if (match) {
        currentBranch = match;
      } else {
        const newNode: NavTreeType = {
          path: getNavTreePath(slug, i),
          token,
          name: getTitleFromToken(token),
          children: [],
        };
        currentBranch.children.push(newNode);
        currentBranch = newNode;
      }
    });

    // reset pointer to root
    currentBranch = navTree;
  }
  return navTree;
}

function getPathFromSlug(slug: string[]) {
  const baseDocsDir = getDocsDir();
  const relPath = slug.join('/');
  let fullPath = path.join(baseDocsDir, relPath);
  if (fs.existsSync(fullPath)) {
    // we know we have a directory, so get the child index.md from that directory
    fullPath += '/index.md';
  } else {
    // we know we have a file
    fullPath += '.md';
  }
  return fullPath;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const baseDocsDir = getDocsDir();
  const docPaths = await glob(path.join(baseDocsDir, '**/*.md'));

  const paths = docPaths.map((docPath: string) => {
    const relPath = docPath.substring(baseDocsDir.length);
    const slug = getSlugFromPath(relPath);
    return { params: { slug } };
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const { params } = context;
  // default slug to be empty for the case where we are in the top level directory's index.md
  const slug = params?.slug || [];
  const fullPath = getPathFromSlug(slug);
  const source = fs.readFileSync(fullPath, 'utf-8');

  const ast = Markdoc.parse(source);
  const content = JSON.stringify(Markdoc.transform(ast, config));

  const navData = await getNavData();

  return {
    props: {
      content,
      navData,
    },
  };
};

const Home: NextPage<Props> = (props) => {
  const { content, navData } = props;
  const parsedContent = JSON.parse(content);

  return (
    <div className="flex flex-col m-auto p-8 max-w-7xl">
      <div className="flex">
        <div className="basis-72">
          <div className="h-screen p-8 overflow-y-auto">
            <NavTree navData={navData} />
          </div>
        </div>
        <div className="basis-0 grow p-16">
          <div className="max-w-3xl">
            {Markdoc.renderers.react(parsedContent, React, {
              components,
            })}
          </div>
        </div>
      </div>
      <div className="text-center">
        Made with{' '}
        <a href="https://docploy.com" className="font-bold text-blue-400">
          Docploy
        </a>
      </div>
    </div>
  );
};

export default Home;
