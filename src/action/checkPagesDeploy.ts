import * as core from '@actions/core';

import axios from 'axios';
import path from 'path';

const DEFAULTS = {
  TIMEOUT: 120, // 2 minutes is recommended because GitHub pages can take 1+ minute to deploy
};

const { GITHUB_SHA = '', BASE_URL = '' } = process.env;

(async function () {
  console.log('here is the baseUrl', BASE_URL);
  const timeout = parseInt(core.getInput('timeout')) || DEFAULTS.TIMEOUT;
  const shortSha = GITHUB_SHA?.substring(0, 7);

  const deployedDocsUrl = path.join(BASE_URL, shortSha);
  const startTime = Date.now();
  const endTime = startTime + timeout * 1000;

  // Poll the docs URL at regular intervals to check when the docs have finished deploying.
  const timer = setInterval(async () => {
    let res;

    try {
      res = await axios.get(deployedDocsUrl);
    } catch (e) {
      console.log(`aWaiting for docs(${deployedDocsUrl}) to be deployed...`);
    }

    if (res && res.status === 200) {
      console.log('We successfully deployed the docs on', deployedDocsUrl);
      clearInterval(timer);
      return;
    }

    if (Date.now() > endTime) {
      console.error('We were unable to deploy the docs.');
      process.exit(1);
    }
  }, 3000);
})();
