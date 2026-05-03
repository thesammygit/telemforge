FROM node:22-slim

WORKDIR /app/frontend

COPY frontend/package.json /app/frontend/package.json
RUN npm install --no-audit --no-fund

COPY frontend /app/frontend

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
