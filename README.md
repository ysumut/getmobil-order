## Getmobil Order Microservice

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Create RSA keys

```bash
$ cd .oauth
$ openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
$ openssl rsa -in private.key -pubout -out public.key
```

## Deployment

Docker
