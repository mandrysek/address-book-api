const { user, contact } = require('./models');

const errorResponse = function (res, err) {
	res.status(err.code).json({
		error: err.message,
		code: err.code
	});
};

const successResponse = function (res, data) {
	res.json({
		success: true,
		data: data
	});
};

module.exports = function (app) {
	app.post('/register', function (req, res) {
		user.create(req.body)
			.then(() => successResponse(res, 'User was created!'))
			.catch((err) => errorResponse(res, err));
	});

	app.post('/login', function (req, res) {
		user.login(req.body)
			.then((token) => successResponse(res, { token: token }))
			.catch((err) => errorResponse(res, err));
	});

	app.post('/contact/create', function (req, res, next) {
		user.validateToken(req.get('Authorization')).then(function (decoded) {
			req.user = decoded.user;
			next();
		}).catch((err) => errorResponse(res, err));
	}, function (req, res) {
		contact.create(req.user, req.body)
			.then(() => successResponse(res, 'Contact was created!'))
			.catch((err) => errorResponse(res, err));
	});
};
