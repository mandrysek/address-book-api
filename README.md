# Address Book API

## Example .env file
```
PORT=3123
NODE_ENV=develop
DB_PG_SCHEMA_TEST=book_test
DB_PG_SCHEMA=book_dev
SECRET_KEY=secret-key-used-for-encryption
FIREBASE_API_KEY=firebase-api-key
FIREBASE_AUTH_DOMAIN=firebase-auth-domain
FIREBASE_DATABASE_URL=firebase-database-url
FIREBASE_STORAGE_BUCKET=firebase-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=firebase-messaging-sender-id
```

## Endpoints
### POST /register
```
Input:
{"name": "Joe Doe", "email": "joe.doe@gmail.com", "password": "secret"}
 
Output:
{"success":true,"data":"User was created!"}
 
- HEADER.Content-Type: application/json
```
### POST /login
```
Input:
{"email": "joe.doe@gmail.com", "password": "secret"}
 
Output:
{"success":true,"data":{"token":"SECRET_TOKEN"}}
 
- HEADER.Content-Type: application/json
```
### POST /contact/create
```
Input:
{"email": "joe.doe@gmail.com", "password": "secret"}
 
Output:
{"success":true,"data":"Contact was created!"}
 
- HEADER.Content-Type: application/json
- HEADER.Authorization: Bearer TOKEN_FROM_LOGIN
```
