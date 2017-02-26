const firebase = require('firebase');
const { validate } = require('../libs/validator');
const { Failure } = require('../libs/error');

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
	phone: {
		type: 'string',
		required: true,
		message: 'Phone is required'
	},
};

const userSchema = {
	name: {
		type: 'string',
		required: false,
		message: 'User name has to be string'
	},
	id: {
		type: 'number',
		required: true,
		message: 'User ID is invalid'
	},
};

const create = function (user, params) {
	const userError = validate(userSchema, user);
	const paramsError = validate(createSchema, params);

	if (userError !== null) {
		return Promise.reject(userError);
	}

	if (paramsError !== null) {
		return Promise.reject(paramsError);
	}

	const contactListRef = firebase.database().ref('user-contacts/' + user.id);
	const newContactRef = contactListRef.push();

	const data = {
		name: params.name,
		email: params.email,
		phone: params.phone
	};

	return newContactRef.set(data).then(function () {
		return Promise.resolve();
	}).catch(function () {
		return Promise.reject(Failure);
	});
};

module.exports = {
	create
};
