FROM node:20.12.0 as build

WORKDIR /app
COPY . /app

RUN npm install -g npm@latest
RUN npm install @angular/cli
RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /app/dist/client/browser /usr/share/nginx/html