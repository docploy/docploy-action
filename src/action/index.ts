import * as core from '@actions/core';
import * as github from '@actions/github';

import axios from 'axios';
import { buildHtml } from 'src/action/markdown';
import { execSync } from 'child_process';
import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import tempDir from 'temp-dir';

const DEFAULTS = {
  USERNAME: 'docs-bot',
  EMAIL: 'test@test.com',
  TIMEOUT: 120, // 2 minutes is recommended because GitHub pages can take 1+ minute to deploy
  PAGES_BRANCH: 'gh-pages',
};

const {
  CI,
  GITHUB_ACTION_PATH = './',
  GITHUB_SHA,
  GITHUB_WORKSPACE = '',
} = process.env;

(async function () {
  if (!GITHUB_SHA) {
    console.error('Unable to find a GITHUB_SHA');
    process.exit(1);
  }
  const username = core.getInput('username') || DEFAULTS.USERNAME;
  const email = core.getInput('email') || DEFAULTS.EMAIL;
  const timeout = parseInt(core.getInput('timeout')) || DEFAULTS.TIMEOUT;
  const pagesBranch = core.getInput('pagesBranch') || DEFAULTS.PAGES_BRANCH;

  const context = github.context;
  const {
    repo: { owner, repo },
  } = context;

  // TODO: Add support for non-GitHub Pages URLs
  const docsRootUrl = `https://${owner}.github.io/${repo}`;

  // generate all of the markdown docs to static html files
  // const mdPath = path.resolve(__dirname, '..', 'docs');
  // const writePath = path.resolve(__dirname, '..', 'static', 'docs');
  // path to the built Next.js assets (html, css, etc)

  // path to the built Next.js assets (html, css, etc)
  // const builtAssetsPath = path.join(GITHUB_WORKSPACE, 'out');

  // TODO: Use the above GITHUB_WORKSPACE path instead
  const builtAssetsPath = path.join(GITHUB_ACTION_PATH, 'out');
  console.log('buildAssetsPath', builtAssetsPath);
  console.log(
    'conents of action docs',
    execSync(`ls -la ${builtAssetsPath}`).toString().trim()
  );

  // Do we still need this? No longer need a temporary directory since we can store all
  // of the generated files in the action folder, and use the action folder as a cache.
  // try {
  //   await fse.mkdirp(writePath);
  // } catch (e) {
  //   console.error(e);
  // }

  // We do not need this any longer since we are going to use Next.js to generate the output files.
  // await buildHtml(mdPath, writePath);

  // There is an environment variable that will allow us to get the SHA commit if this does not work.
  // const shortSha = execSync('git rev-parse --short HEAD').toString().trim();
  const shortSha = GITHUB_SHA.substring(0, 7);
  console.log('shortSha', shortSha);
  // const sourceDir = path.join(__dirname, '..', 'static', 'docs');

  // const tempShaDir = path.join(tempDir, shortSha);

  // try {
  //   await fse.mkdirp(tempShaDir);
  // } catch (e) {
  //   console.error(e);
  // }

  // try {
  //   await fse.copy(sourceDir, tempShaDir);
  // } catch (e) {
  //   console.error(e);
  // }

  // // Do we actually need this code, or were we using this as debugging code?
  // try {
  //   await fs.promises.readdir(tempShaDir);
  // } catch (e) {
  //   console.error(e);
  // }

  // change working directory to main repo
  execSync(`cd ${GITHUB_WORKSPACE}`);

  // make sure that we changed the directory correctly
  console.log(execSync(`ls -la`).toString().trim());
  console.log('after listing contents');

  if (CI) {
    execSync(`git config --global user.email "${email}"`);
    execSync(`git config --global user.name "${username}"`);
  }

  // git fetch
  execSync('git fetch');

  // git switch
  execSync(`git switch -c ${pagesBranch}`);

  execSync('git clean -f -d');

  // Do we need to rebase? The git commit history should be able to be wiped completely.
  // Let the user know that we will be wiping the branch.
  // execSync(`git rebase origin/${pagesBranch}`);

  // move files from temp directory to the root
  const workspaceDocsPath = path.join(GITHUB_WORKSPACE, shortSha);

  // remove the existing directory if it exists
  // this will happen if someone tries to push the same commit hash again
  try {
    await fs.promises.rm(workspaceDocsPath, { recursive: true });
  } catch (e) {
    console.error('There was an error removing the directory', e);
  }

  // try {
  //   await fse.move(tempShaDir, newDir);
  // } catch (e) {
  //   console.error(
  //     'There was an error moving the temporary directory into the new directory',
  //     e
  //   );
  // }

  try {
    await fse.move(builtAssetsPath, workspaceDocsPath);
  } catch (e) {
    console.error(
      'There was an error moving the temporary directory into the new directory',
      e
    );
  }

  execSync('git add .');

  const time = Date.now();
  try {
    execSync(`git commit -m "Publishing docs for ${shortSha}"`);
  } catch (e: any) {
    const stdErrMsg = e.stderr.toString('utf-8');
    console.error('There was an error creating a new commit:', stdErrMsg);
  }

  process.exit(1);
  execSync(`git push --set-upstream origin ${pagesBranch}`);

  const startTime = Date.now();
  const endTime = startTime + timeout * 1000;

  const docsUrl = docsRootUrl + '/' + shortSha;

  // Keep polling the docs at regular intervals to check when the docs have finished deploying.
  const timer = setInterval(async () => {
    let res;

    try {
      res = await axios.get(docsUrl);
    } catch (e) {
      console.log(`Waiting for docs(${docsUrl}) to be deployed...`);
    }

    if (res && res.status === 200) {
      console.log('We successfully deployed the docs on', docsUrl);
      clearInterval(timer);
      return;
    }

    if (Date.now() > endTime) {
      console.error('We were unable to deploy the docs.');
      process.exit(1);
    }
  }, 3000);
})();
