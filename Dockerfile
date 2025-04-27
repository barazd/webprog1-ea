# Megéptjük a React proejktet
FROM node:23-alpine AS build-stage

RUN mkdir -p /app/feladat_1 && mkdir /app/feladat_2
COPY ./feladat_2 /app/feladat_2
COPY ./feladat_1/style.css /app/feladat_1

WORKDIR /app/feladat_2

RUN npm install 
RUN npm run build

# Megépítjük a rendes konténert
FROM nginx:alpine

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir /usr/share/nginx/html/feladat_1 && mkdir /usr/share/nginx/html/feladat_2

COPY ./feladat_1 /usr/share/nginx/html/feladat_1
COPY --from=build-stage /app/feladat_2/dist /usr/share/nginx/html/feladat_2