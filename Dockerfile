FROM node:slim
COPY . .
RUN ls -la
RUN yarn
ENTRYPOINT ["node", "/dist/index.js"]