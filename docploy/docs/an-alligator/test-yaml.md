# This is the test-yaml.md

```yaml
on: [push]

jobs:
  docploy:
    name: Docploy
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
    steps:
      - name: Publish docs
        uses: docploy/docploy-action@v1.4
        with:
          baseUrl: 'https://<org>.github.io/<repo>' # replace this with your GitHub Pages url
          docsDir: 'docs'
```
