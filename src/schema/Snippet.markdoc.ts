import { RenderableTreeNode, Schema } from '@markdoc/markdoc';

import { TEST_RESULTS_FILENAME } from 'src/utils/constants';
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
  validate(node) {
    if (node.attributes.paths.length === 0) {
      return [
        {
          id: 'snippet-paths',
          level: 'critical',
          message: 'Snippet is missing the `paths` attribute.',
        },
      ];
    }
    return [];
  },
  transform(node, config): RenderableTreeNode {
    const attributes = {
      ...node.transformAttributes(config),
    };
    const { paths } = attributes;
    const baseDocsDir = getDocsDir();
    let rawTestResults = '';

    const testResultsPath = pathPkg.join(
      process.env.GITHUB_WORKSPACE || '',
      process.env.DOCPLOY_DIR || '',
      TEST_RESULTS_FILENAME
    );
    try {
      rawTestResults = fs.readFileSync(testResultsPath, 'utf8');
    } catch (e) {
      console.error('Error reading test results file:', e);
    }
    const testResults = JSON.parse(rawTestResults);

    // This may not be necessary when we enable Markdown.validate(...)
    if (!paths || paths.length === 0) {
      throw new Error('Snippet `paths` attribute is empty');
    }

    const snippets = paths.map((path: string) => {
      // TODO: need to add a check to make sure path exists
      // Do the check in the validate method
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
