require('dotenv').config();
const assert = require('assert');
const proxyquire = require('proxyquire');
const originalEnv = process.env.NODE_ENV;
process.env.NODE_ENV = 'test';

const MockupFirebaseDB = require('../libs/mockup-firebase/database');

const { test } = require('../libs/database')
const { user } = require('../models');

const contact = proxyquire('../models/contact.js', {
	firebase: {
		database: function () {
			return MockupFirebaseDB;
		}
	}
});

describe('Test preparation', function () {
	it('test schema prepared', function (done) {
		test().then(function () {
			done();
		}).catch(function (err) {
			done(err);
		})
	});
});

describe('Tests', function () {
	let userToken = null;
	let userData = null;

	it('user input schema validation should fail', function (done) {
		const body = {
			name: "Joe Doe",
			email: "joe.doegmail.com"
		};

		user.create(body).then(function () {
			done(new Error('Error should appear'));
		}).catch(function (err) {
			if (
				err.message.indexOf('[email] Email must be valid') >= 0
				&& err.message.indexOf('[password] Password is required') >= 0
			) {
				done();
			} else {
				done(new Error('Invalid Error appeared'));
			}
		});
	});

	it('user should be created successfully', function (done) {
		const body = {
			name: "Joe Doe",
			email: "joe.doe@gmail.com",
			password: "secret-password"
		};

		user.create(body).then(function () {
			done();
		}).catch(function (err) {
			done(err);
		});
	});

	it('user login should fail', function (done) {
		const body = {
			email: "joe.doe@gmail.com",
			password: "incorrect-password"
		};

		user.login(body).then(function () {
			done(new Error('User login didn`t fail'));
		}).catch(function (err) {
			if (err.message.indexOf('Invalid password') >= 0) {
				done();
			} else {
				done(new Error('Invalid Error appeared'));
			}
		});
	});

	it('user should login successfully', function (done) {
		const body = {
			email: "joe.doe@gmail.com",
			password: "secret-password"
		};

		user.login(body).then(function (res) {
			userToken = res;
			done();
		}).catch(function (err) {
			done(err);
		});
	});

	it('user token validation should fail', function (done) {
		user.validateToken('Bearer ' + 'invalid-token').then(function () {
			done(new Error('Token validation didn`t fail'));
		}).catch(function (err) {
			if (err.message.indexOf('Token is invalid') >= 0) {
				done();
			} else {
				done(new Error('Invalid Error appeared'));
			}
		});
	});

	it('user token should validate successfully', function (done) {
		user.validateToken('Bearer ' + userToken).then(function (res) {
			userData = res.user;
			done();
		}).catch(function (err) {
			done(err);
		});
	});

	it('contact should be created successfully', function (done) {
		const body = {
			name: "Peter Doe",
			email: "peter.doe@gmail.com",
			phone: "+420765432198",
		};
		const contactCreate = contact.create(userData, body, false);
		contactCreate.then(function () {
			done();
		}).catch(function (err) {
			done(err);
		})
	});
});
