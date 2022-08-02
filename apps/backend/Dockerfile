FROM node:16-alpine AS baseImage
ARG PNPM_VERSION=7.7.0
RUN npm --no-update-notifier --no-fund --location=global install pnpm@${PNPM_VERSION}
WORKDIR /repo

FROM baseImage AS workspace
WORKDIR /repo
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY . ./
RUN pnpm install -r --offline && pnpm --filter "backend" prisma:generate && pnpm --filter "backend" build


FROM workspace as pruned
ARG SCOPE
ENV SCOPE=${SCOPE}
RUN pnpm --filter ${SCOPE} --prod deploy pruned

FROM node:16-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=pruned /repo/pruned .
USER node
EXPOSE ${PORT}
ENV PORT ${PORT}

CMD ["node", "dist/src/main.js"]