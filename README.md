# Docploy Action

The Docploy action deploys documentation to GitHub Pages. The documentation is tightly coupled with your code, which prevents documentation from going out of date. All code snippets used in the docuemntation can be imported and tested.

Traditionally, there are no checks to guarantee that documentation stays up to date. There might be a process where documentation is manually proofread at regular intervals, but this does not scale as you reach hundreds of pages of documentation. This process is like if you had to manually run your code's unit tests each week. Instead, this action will not allow you to deploy broken documentation, so you can rest knowing your documentation is always correct.

# Setup

## Set up GitHub Pages

1. Go to your repo's **Settings** page
2. Click on **Pages** in the left sidebar
3. Under **Source**, select the **gh-pages** branch (this is recommended, but you can select another branch), and click **Save**

_Note: this action will overwrite the contents in the branch you select!_

## Add action to your workflow

Add a new job to your GitHub workflow yml file located at `.github/workflows/main.yml`

```
on: [push]

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
```
