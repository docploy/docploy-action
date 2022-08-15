import { RenderableTreeNode, Schema } from '@markdoc/markdoc';

import { Tag } from '@markdoc/markdoc';
import { TestStatus } from 'src/types';
import detect from 'language-detect';
import fs from 'fs';
import { getCodeBlock } from 'src/utils/snippetParser';
import { getDocsDir } from 'src/utils/helpers';
import pathPkg from 'path';

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
    console.log('testResultsPath', testResultsPath);
    const rawTestResults = fs.readFileSync(testResultsPath, 'utf8');
    console.log('rawTestResults', rawTestResults);
    const testResults = JSON.parse(rawTestResults);

    const snippets = paths.map((path: string) => {
      const fullPath = pathPkg.join(baseDocsDir, path);
      const language = detect.sync(fullPath);
      const content = getCodeBlock(fullPath);

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
