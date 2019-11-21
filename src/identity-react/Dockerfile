FROM node

RUN mkdir -p /srv/app/client
WORKDIR /srv/app/client

COPY ./package.json /srv/app/client
COPY ./package-lock.json /srv/app/client
COPY . /srv/app/client

RUN npm install

EXPOSE 3000

CMD npm start
