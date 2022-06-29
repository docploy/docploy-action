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

type Props = {
  content: string;
  navData: NavTreeType;
};

interface Params extends ParsedUrlQuery {
  docPath: string;
  slug: string[];
}

const baseDocsDir = path.join(process.cwd(), '..', 'docs');

function getSlugFromPath(relPath: string) {
  const slug = relPath.replace('.md', '').split('/').slice(1);
  const filename = slug[slug.length - 1];

  // remove index and only keep the directory name
  if (filename === 'index') {
    slug.pop();
  }

  return slug;
}

// TODO: move into a utils folder
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTitleFromToken(str: string) {
  const split = str.split('-');
  const capitalizedSplit = split.map((word: string) => {
    return capitalize(word);
  });
  return capitalizedSplit.join(' ');
}

async function getNavData() {
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
        // different behavior for leaf nodes
        const isLeaf = i === slug.length - 1;
        const newNode: NavTreeType = {
          path: '/' + slug.slice(0, i + 1).join('/'),
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
  );
};

export default Home;
