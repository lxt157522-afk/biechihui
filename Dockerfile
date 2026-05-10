FROM node:20-alpine AS base
WORKDIR /app

# Install build tools for native modules
RUN apk add --no-cache python3 make g++

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm config set registry https://npm.mirrors.msh.team
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-alpine AS production
RUN apk add --no-cache libstdc++
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 3000
CMD ["npm", "start"]
