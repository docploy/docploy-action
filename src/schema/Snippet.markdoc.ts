import { RenderableTreeNode, Schema } from '@markdoc/markdoc';

import { Tag } from '@markdoc/markdoc';
import { TestStatus } from 'src/types';
import detect from 'language-detect';
import fs from 'fs';
import { getDocsDir } from 'src/utils/helpers';
import lineByLine from 'n-readlines';
import pathPkg from 'path';

function getContentFromPath(path: string) {
  let source = '';
  const liner = new lineByLine(path);
  let line;
  while ((line = liner.next())) {
    source += line + '\n';
  }

  return source;
}

export const snippet: Schema = {
  render: 'Snippet',
  attributes: {
    paths: {
      type: Array,
    },
  },
  transform(node, config): RenderableTreeNode {
    const attributes = {
      ...node.transformAttributes(config),
    };
    const { paths } = attributes;
    const baseDocsDir = getDocsDir();

    const testResultsPath = pathPkg.join(
      process.env.GITHUB_WORKSPACE || '',
      process.env.DOCPLOY_DIR || '',
      process.env.TEST_RESULTS_FILENAME || ''
    );
    const rawTestResults = fs.readFileSync(testResultsPath, 'utf8');
    const testResults = JSON.parse(rawTestResults);

    const snippets = paths.map((path: string) => {
      const fullPath = pathPkg.join(baseDocsDir, path);
      const language = detect.sync(fullPath);
      const content = getContentFromPath(fullPath);

      let status: TestStatus = 'unknown';
      let runTime: number = Date.now();

      if (testResults[path]) {
        status = testResults[path].status;
        runTime = testResults[path].time;
      }

      return { language, content, status, runTime };
    });
    return new Tag('Snippet', { snippets }, []);
  },
};
