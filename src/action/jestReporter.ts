import 'dotenv/config';

import { Reporter, TestContext } from '@jest/reporters';

import { AggregatedResult } from '@jest/test-result';
import { TEST_RESULTS_FILENAME } from 'src/utils/constants';
import fs from 'fs';
import { getProjectDir } from 'src/utils/helpers';
import path from 'path';

type TestResults = {
  [filename: string]: {
    time: number;
    status: 'passed' | 'failed';
  };
};

// Run the following command to build this reporter file:
//   yarn run ncc build -s ./src/action/jestReporter.ts -o ./dist/jestReporter
// Then, run the following command to run the built file:
//   yarn jest ./docploy/ --reporters="default" --reporters="./dist/jestReporter/index.js"

export default class DocployReporter
  implements Pick<Reporter, 'onRunComplete'>
{
  async onRunComplete(_: Set<TestContext>, results: AggregatedResult) {
    const baseProjectDir = getProjectDir();
    const testResults: TestResults = {};

    const time = results.startTime;

    results.testResults.forEach((result) => {
      const path = result.testFilePath;
      let relPath = path.slice(baseProjectDir.length);

      if (relPath.charAt(0) === '/') {
        relPath = relPath.slice(1);
      }
      const hasFailure = result.testResults.some((itResult) => {
        return itResult.status === 'failed';
      });
      const status = hasFailure ? 'failed' : 'passed';
      testResults[relPath] = {
        time,
        status,
      };
    });

    const data = JSON.stringify(testResults);

    const docployDir = path.join(
      process.env.GITHUB_WORKSPACE || '',
      process.env.DOCPLOY_DIR || ''
    );

    const writePath = path.join(docployDir, TEST_RESULTS_FILENAME);

    try {
      await fs.promises.access(docployDir);
    } catch (e) {
      await fs.promises.mkdir(docployDir, { recursive: true });
    }

    try {
      await fs.promises.writeFile(writePath, data, { flag: 'w+' });
    } catch (e) {
      console.error(e);
    }
  }
}
