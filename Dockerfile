FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache python3 make g++ libstdc++

FROM base AS build
COPY package.json package-lock.json ./
RUN npm config set registry https://registry.npmjs.org
RUN npm ci --prefer-offline --no-audit
COPY . .
RUN npm run build

FROM node:20-alpine AS production
RUN apk add --no-cache python3 make g++ libstdc++
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
EXPOSE 3000
CMD ["npm", "start"]
