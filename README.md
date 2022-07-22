# Docploy Action

The Docploy action deploys your Markdown files to GitHub Pages.

Docploy was built as a "docs-as-code", or a "docops" solution for technical documentation. There are common tasks related to the upkeep and maintenance technical documentation that can be automated.

How many times have you found out that your docs were no longer up to date? This action allows you to run tests on code snippets in your docs, which will save a lot of developer time!

How many extra hours has your pull request been blocked because of a style issue? This action can validate markdown files to make sure they follow style rules. Developers do not need to read style guides because the style is codified within rules.

# Setup

## 1. Add the action to your workflow

You can add a new job to your GitHub workflow yml file located at `.github/workflows/main.yml`

```
on: [pull_request]

jobs:
  publish_docs:
    name: Publish docs
    runs-on: ubuntu-latest
    steps:
      - name: Publish docs
        uses: docploy/docploy-action@{version}
        with:
          baseUrl: 'https://{username}.github.io/{repo}/'
          docsDir: 'docs'
          pagesBranch: 'gh-pages'
```

**_Note: this config will overwrite all files in your repo's pagesBranch_**

## 2. Create a new branch

1. Go to your repo's branches at: https://github.com/{org}/{repo}/branches
2. Click **New branch**
3. Enter **gh-pages** (or another branch name) for the **Branch name**
4. Click on **Create branch** to create the new branch

## 3. Set up GitHub Pages

1. Go to your repo's **Settings** page
2. Click on **Pages** in the left sidebar
3. Under **Source**, select the **gh-pages** branch (or branch that you defined as `pagesBranch` in the action inputs), and click **Save**

## 4. Run the workflow

Create a new pull request to trigger the workflow.

# Example

See this [example repo](https://github.com/docploy/example)

# Usage

You should write all documentation as Markdown files (with file extension `.md`) inside of the `docsDir` path defined in your GitHub Action's job metadata.

When the Docploy GitHub Action runs, the output will contain a link to the preview documentation site:

```
Waiting for docs to be deployed to: https://{username}.github.io/{repo}/e6c2d5b
Waiting for docs to be deployed to: https://{username}.github.io/{repo}/e6c2d5b
We successfully deployed the docs on: https://{username}.github.io/{repo}/e6c2d5b
```

# Testing Your Code Snippets

You can use a `<% snippet path={path} %>` tag to import a code snippet into your docs during build time.

The `path` attribute is the location to your code snippet relative to the `docsDir` that you specified as part of the job metadata.

The advantage of using a `<% snippet %>` tag, instead of embedding the code into the Markdown file, is you can import any dependencies from the file and you can run your chosen testing framework on the file.

## Example

This `docs/example.md` file will render the code from the `example.js` file:

```
# Code snippet

{% snippet path="example.js" /%}
```

The `example.js` file is located at `docs/example.js`:

```
function snippet() {
  return 1 + 1;
}

export default snippet;
```

The test file, `example.test.js`, uses the Jest testing framework for Javascript, and it is located at `docs/example.test.js`:

```
import example from './example';

describe('example', () => {
  it('should return 2', () => {
    const result = example();
    expect(result).toBe(2);
  });
});

```

# Running Your Tests

You should run your doc tests on every new pull request that modifies your docs. This will guarantee your docs will always be up to date.

## Javascript

You can run Jest as part of your GitHub workflow to test your doc snippets.
Add the following job to your GitHub workflow yml file located at `.github/workflows/main.yml`

It is a best practice to run the testing job as a separate job from the deploy job to parallelize the two jobs, so they can finish quicker.

```
jobs:
  ...
  test_docs:
    name: Test docs
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          yarn install
          yarn run jest docs
```
