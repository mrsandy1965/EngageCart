FROM node:22-alpine AS Builder

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
