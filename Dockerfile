FROM node:21-alpine as cache

WORKDIR /app/backend

COPY backend/package.json .
COPY backend/package-lock.json .

RUN npm install

WORKDIR /app/frontend

COPY frontend/package.json .
COPY frontend/package-lock.json .

RUN npm install

FROM cache as compiler

WORKDIR /app/backend

COPY --from=cache /app/backend/node_modules ./node_modules

COPY ../backend .

RUN npm run build

WORKDIR /app/frontend

COPY --from=cache /app/frontend/node_modules ./node_modules

COPY ../frontend .

RUN npm run build

FROM compiler as deps
WORKDIR /app/backend

COPY backend/package.json .
COPY backend/package-lock.json .

RUN npm install --only=production

WORKDIR /app/frontend

COPY frontend/package.json .
COPY frontend/package-lock.json .

RUN npm install --only=production

FROM compiler as runtime
WORKDIR /app/frontend
COPY --from=deps /app/frontend/node_modules ./node_modules
COPY --from=compiler /app/frontend/dist .


WORKDIR /app/backend
COPY --from=deps /app/backend/node_modules ./node_modules
COPY --from=compiler /app/backend/dist .

EXPOSE 3000

CMD ["node", "dist/main.js"]
