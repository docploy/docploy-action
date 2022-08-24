echo "Sending analytics about this run..."

curl -i -X POST https://plausible.io/api/event \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36 OPR/71.0.3770.284' \
  -H 'X-Forwarded-For: 127.0.0.1' \
  -H 'Content-Type: application/json' \
  --data '{"name":"Run","url":"https://github.com","domain":"docploy.com","screen_width":1666,"props":{"owner":"${GITHUB_REPOSITORY}"}}'