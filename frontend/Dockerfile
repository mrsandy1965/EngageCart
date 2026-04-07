FROM node:22-alpine AS builder

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
