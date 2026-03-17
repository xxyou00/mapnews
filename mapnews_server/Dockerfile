FROM node:20-slim

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY . .

# HF Spaces 要求监听 7860 端口
ENV PORT=7860

EXPOSE 7860

CMD ["node", "server.js"]
