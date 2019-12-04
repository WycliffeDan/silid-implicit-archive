silid
=====

This client app was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The server app was produced by `express-generator` and was scrounged from the ruined heap of a now forgotten app with the exact same purpose. It is backed by a `sequelize`/`postgres` pairing.

The following describes how to deploy the combined application to a local development environment and run end-to-end tests.

## Server

From the `src/silid-server` project directory:

```
npm install
cp .env.example .env
```

### Test

Apart from the client-driven e2e tests, the server has tests of its own. It requires a PostgreSQL development server. Here's how I start one with `docker`:

```
docker run --name dev-postgres -p 5432:5432 -d postgres
```

Execute server-specific tests:

```
npm test
```

## Client

From the `src/identity-react` project directory:

```
npm install
cp .env.example .env
```

### Client build server

In a new shell, from the `src/identity-react` project directory:

```
npm start
```

### e2e API test server

The client application tests against a local instance of the `silid-server` and a special mock server whose purpose is to return a public key with which to verify an Auth0 access token. These tests _do not_ execute against a live server.

The `silid-server`/mock server combo are containerized. In a separate shell, from the `src/silid-server` project directory, launch the e2e API server:

```
docker-compose -f docker-compose.e2e.yml up --build
```

### Execute e2e tests 

End-to-end tests depend on `cypress`. They are executed from the `src/identity-react` project directory. Tests may be executed in your preferred browser, or _headlessly_, as may be appropriate in a staging environment.

#### In-browser tests:

This will open an interface and allow you to watch your tests execute:

```
npx cypress open
```

#### _Headless_ tests:

`cypress` is executed in a container in this case, so first execution will be slow:

```
npm run test:headless
```

