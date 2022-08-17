import { RenderableTreeNode, Schema, ValidationError } from '@markdoc/markdoc';

import { TEST_RESULTS_FILENAME } from 'src/utils/constants';
import { Tag } from '@markdoc/markdoc';
import { TestStatus } from 'src/types';
import detect from 'language-detect';
import fs from 'fs';
import { getCodeBlock } from 'src/utils/snippetParser';
import { getProjectDir } from 'src/utils/helpers';
import pathPkg from 'path';

export const snippet: Schema = {
  render: 'Snippet',
  attributes: {
    paths: {
      type: Array,
    },
  },
  validate(node) {
    const {
      attributes: { paths },
    } = node;
    const errors: ValidationError[] = [];
    if (!paths || paths.length === 0) {
      errors.push({
        id: 'snippet-missing-paths-attribute',
        level: 'critical',
        message: 'Snippet is missing the `paths` attribute.',
      });
    }

    paths.forEach((path: string) => {
      const baseProjectDir = getProjectDir();
      const fullPath = pathPkg.join(baseProjectDir, path);
      if (!fs.existsSync(fullPath)) {
        errors.push({
          id: 'snippet-invalid-path',
          level: 'critical',
          message: `Snippet path ${path} does not exist`,
        });
      }
    });
    return errors;
  },
  transform(node, config): RenderableTreeNode {
    const attributes = {
      ...node.transformAttributes(config),
    };
    const { paths } = attributes;
    const baseProjectDir = getProjectDir();
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

    const snippets = paths.map((path: string) => {
      const fullPath = pathPkg.join(baseProjectDir, path);
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
