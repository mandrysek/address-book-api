const validator = require('validate');

const validate = function (schema, obj) {
	let errors = validator(schema).validate(obj);

	if (!errors.length) {
		return null
	}

	const error = new Error(errors.map(function (error) {
		return `[${error.path}] ${error.message}`;
	}).join(' '));

	error.code = 400;

	return error;
};

module.exports = {
	validate
};
