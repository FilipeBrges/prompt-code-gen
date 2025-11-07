# Dockerfile for PromptCodeGen Frontend
FROM node:18-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview"]
