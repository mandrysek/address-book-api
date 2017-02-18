const { validate } = require('../libs/validator');
const db = require('../libs/database');
const bcrypt = require('bcrypt');
const { BadRequest, NotFound, Forbidden, Failure } = require('../libs/error');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || '';

const createSchema = {
	name: {
		type: 'string',
		required: true,
		message: 'Name is required'
	},
	email: {
		type: 'string',
		required: true,
		match: /.+@.+\..+/,
		message: 'Email must be valid'
	},
	password: {
		type: 'string',
		required: true,
		message: 'Password is required'
	},
};

const loginSchema = {
	email: {
		type: 'string',
		required: true,
		match: /.+@.+\..+/,
		message: 'Email must be valid'
	},
	password: {
		type: 'string',
		required: true,
		message: 'Password is required'
	},
};

const create = function (params) {
	const error = validate(createSchema, params);

	return new Promise(function (resolve, reject) {
		if (error !== null) {
			reject(error);
			return;
		}

		const selectQuery = `SELECT id FROM ${db.schema}.user WHERE email = $1`;

		return db.query(selectQuery, [params.email]).then(function ({ rows }) {
			if (rows.length) {
				reject(BadRequest('User with this email already exist'))
				return;
			}

			bcrypt.hash(params.password + secretKey, 10).then(function (hash) {
				const insertQuery = `INSERT INTO ${db.schema}.user (name, email, password) VALUES ($1, $2, $3)`;
				db.query(insertQuery, [params.name, params.email, hash], true).then(function () {
					resolve()
				}).catch(function () {
					reject(Failure('User couldn`t be created'));
				});
			}).catch(function () {
				reject(BadRequest('Password couldn`t be encrypted.'))
			});
		}).catch(function () {
			reject(Failure('User couldn`t be created'));
		});
	});
};

const login = function (params) {
	const error = validate(loginSchema, params);

	return new Promise(function (resolve, reject) {
		if (error !== null) {
			return reject(error);
		}
		const selectQuery = `SELECT id, name, password FROM ${db.schema}.user WHERE email = $1`;

		db.query(selectQuery, [params.email], true).then(function ({rows}) {
			const user = rows[0];
			if (!user) {
				reject(NotFound('User couldn`t be found'))
				return;
			}

			bcrypt.compare(params.password + secretKey, user.password).then(function (res) {
				if (!res) {
					reject(Forbidden('Invalid password'));
					return;
				}

				jwt.sign({
					user: {
						id: user.id,
						name: user.name
					},
				}, secretKey, {
					expiresIn: '1h'
				}, function (err, token) {
					if (err) {
						return reject(BadRequest('Failed to login'))
					}

					resolve(token);
				});
			}).catch(function () {
				reject(Failure());
			})
		})
	});
};

const validateToken = function (req) {
	return new Promise(function (resolve, reject) {
		const parts = req.get('Authorization').split(' ');
		if (parts.length === 2 && parts[0] === 'Bearer') {
			const token = parts[1];
			jwt.verify(token, secretKey, function (err, decoded) {
				if (err) {
					switch (err.name) {
						case 'TokenExpiredError':
							return reject(Forbidden('Token expired'));
						default:
							return reject(Forbidden('Token is invalid'));
					}
				}
				resolve(decoded);
			});
		} else {
			reject(Forbidden('Token is invalid'))
		}
	})
};

module.exports = {
	create,
	login,
	validateToken
};
