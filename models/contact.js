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

	return new Promise(function (resolve, reject) {
		if (userError !== null) {
			reject(userError);
			return;
		}

		if (paramsError !== null) {
			reject(paramsError);
			return;
		}

		const contactListRef = firebase.database().ref('user-contacts/' + user.id);
		const newContactRef = contactListRef.push();

		newContactRef.set({
			name: params.name,
			email: params.email,
			phone: params.phone
		}).then(function () {
			resolve();
		}).catch(function () {
			reject(Failure);
		});
	});
};

module.exports = {
	create
};
