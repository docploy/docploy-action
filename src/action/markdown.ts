import Markdoc from '@markdoc/markdoc';
import fs from 'fs';
import fse from 'fs-extra';
import glob from 'glob-promise';
import path from 'path';

function transformMarkdownToHtml(markdown) {
  const ast = Markdoc.parse(markdown);
  const content = Markdoc.transform(ast);
  const html = Markdoc.renderers.html(content);
  return html;
}

/**
 * Recursively generate html files for each markdown file in the src directory.
 * @param {string} src
 * @param {string} dest
 */
export async function buildHtml(src, dest) {
  const files = await glob(path.join(src, '**/*.md'));

  for (const file of files) {
    const markdown = await fs.promises.readFile(file, { encoding: 'utf-8' });
    const html = transformMarkdownToHtml(markdown);
    const writePath = file.replace(src, dest).replace('.md', '.html');

    // ensure that the parent directory is created
    const parentDir = path.dirname(writePath);
    try {
      await fse.mkdirp(parentDir);
    } catch (e) {
      console.error(e);
    }

    // create the file
    try {
      await fs.promises.writeFile(writePath, html, { flag: 'a' });
    } catch (e) {
      console.error(e);
    }
  }
}
