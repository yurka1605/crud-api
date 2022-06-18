# CRUD-API

**Users API has some methods:**

**GET** api/users - get users list

**POST** api/users - create new user

**GET** api/users/${_userId_} - get user by ID

**PUT** api/users/${_userId_} - update all user field

**PATCH** api/users/${_userId_} - update part of user fields

**DELETE** api/users/${_userId_} - delete user

## Manual postman testing

[postman-crud-api-collection](https://www.postman.com/collections/7e2a1fc56700d7c115be)

## Installing

| Name                           | Action                          |
| ------------------------------ | ------------------------------- |
| Install dependencies           | `npm install`                   |
| Add `.env` file                | Rename `.env.example` to `.env` |
| Run dev server                 | `npm run start:dev`             |
| Build and run prod server      | `npm run start:prod`            |
| Build and run a server cluster | `npm run start:multi`           |
| Run tests scenarios            | `npm test`                      |
