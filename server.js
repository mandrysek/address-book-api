require('dotenv').config();

if (!process.env.DATABASE_URL) {
	console.log('Database is not provided');
	process.exit(0);
}

const port = process.env.PORT || 8080;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');
const firebase = require('firebase');
const db = require('./libs/database');

firebase.initializeApp({
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.FIREBASE_DATABASE_URL,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
});

db.sync.then(function () {
	app.use(bodyParser.json());
	routes(app);
	app.listen(port, function () {
		console.log(`App listening on port ${port}!`)
	});
}).catch(function (err) {
	console.error(err);
})
