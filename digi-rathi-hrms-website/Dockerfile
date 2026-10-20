FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci --omit=dev --ignore-scripts
COPY . /app
RUN mkdir -p /app/data && chown -R node:node /app
USER node
ENV HOST=0.0.0.0 PORT=4174
VOLUME ["/app/data"]
EXPOSE 4174
CMD ["node", "server.js"]
