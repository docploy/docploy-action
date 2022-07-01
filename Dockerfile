FROM node:slim
COPY . ./action
RUN yarn
ENTRYPOINT ["node", "/dist/index.js"]