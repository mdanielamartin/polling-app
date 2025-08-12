
FROM node:20

WORKDIR /polling-app/frontend

COPY ./frontend /polling-app/frontend/


RUN npm install && npm run build


EXPOSE 3000


CMD ["npm", "run","dev"]
