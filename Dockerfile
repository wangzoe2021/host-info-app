FROM node:16-alpine AS ui-build
WORKDIR /usr/src/app
COPY frontend/ ./frontend/
RUN cd frontend && npm ci && npm run build

FROM node:16 AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/frontend ./frontend
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend/server.js ./backend/

EXPOSE 3000
EXPOSE 5000

# CMD ["npx", "serve", "build", "&", "node", "./backend/server.js"]
CMD npm start --prefix ./frontend & node ./backend/server.js