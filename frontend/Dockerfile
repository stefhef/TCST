FROM node:alpine as build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 
FROM nginx:alpine
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./cert/taskcheckingsystem.crt /etc/ssl/taskcheckingsystem.crt
COPY ./cert/taskcheckingsystem.key /etc/ssl/taskcheckingsystem.key
COPY ./cert/ca.crt /etc/ssl/ca.crt
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
RUN chown nginx:nginx /usr/share/nginx/html/*
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
