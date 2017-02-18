const errorInstance = function (message, code) {
	const error = new Error(message);
	error.code = code;
	return error;
};

module.exports = {
	Failure: (message = 'There is some error. We will fix it soon', code = 500) => (errorInstance(message, code)),
	NotFound: (message = 'Not found', code = 404) => (errorInstance(message, code)),
	BadRequest: (message = 'Bad Request', code = 400) => (errorInstance(message, code)),
	Forbidden: (message = 'Forbidden', code = 403) => (errorInstance(message, code)),
};
