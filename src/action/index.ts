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
  TIMEOUT: 60,
  PAGES_BRANCH: 'gh-pages',
  WORKSPACE: '',
};

const { CI } = process.env;

(async function () {
  const username = core.getInput('username') || DEFAULTS.USERNAME;
  const email = core.getInput('email') || DEFAULTS.EMAIL;
  const timeout = parseInt(core.getInput('timeout')) || DEFAULTS.TIMEOUT;
  const pagesBranch = core.getInput('pagesBranch') || DEFAULTS.PAGES_BRANCH;
  const workspace = core.getInput('workspace') || DEFAULTS.WORKSPACE;

  console.log('here is the workspace', workspace);
  console.log('print out current dir');
  console.log(execSync('ls -la').toString().trim());

  const context = github.context;
  const {
    repo: { owner, repo },
  } = context;

  const docsRootUrl = `https://${owner}.github.io/${repo}`;

  // generate all of the markdown docs to static html files
  const mdPath = path.resolve(__dirname, '..', 'docs');
  const writePath = path.resolve(__dirname, '..', 'static', 'docs');

  try {
    await fse.mkdirp(writePath);
  } catch (e) {
    console.error(e);
  }

  await buildHtml(mdPath, writePath);

  const shortSha = execSync('git rev-parse --short HEAD').toString().trim();
  const sourceDir = path.join(__dirname, '..', 'static', 'docs');

  const tempShaDir = path.join(tempDir, shortSha);

  try {
    await fse.mkdirp(tempShaDir);
  } catch (e) {
    console.error(e);
  }

  try {
    await fse.copy(sourceDir, tempShaDir);
  } catch (e) {
    console.error(e);
  }

  try {
    await fs.promises.readdir(tempShaDir);
  } catch (e) {
    console.error(e);
  }

  if (CI) {
    execSync(`git config --global user.email "${email}"`);
    execSync(`git config --global user.name "${username}"`);
  }

  // git fetch
  execSync('git fetch');

  // git switch
  execSync(`git switch -c ${pagesBranch}`);

  execSync('git clean -f -d');

  // move files from temp directory to the root
  const newDir = path.join('.', shortSha);
  try {
    await fse.move(tempShaDir, newDir);
  } catch (e) {
    console.error(e);
  }

  execSync('git add .');

  execSync(`git commit -m ${shortSha}`);

  execSync(`git push --set-upstream origin ${pagesBranch}`);

  const startTime = Date.now();
  const endTime = startTime + timeout * 1000;

  const docsUrl = docsRootUrl + '/' + shortSha;

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
