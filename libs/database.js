const schema = process.env.NODE_ENV === 'test' ? process.env.DB_PG_SCHEMA_TEST : process.env.DB_PG_SCHEMA;
const pg = require('pg');

const query = function (query, params, end = false) {
	return new Promise(function (resolve, reject) {
		const client = new pg.Client(process.env.DATABASE_URL + '?ssl=true');
		client.connect(function (err) {
			if (err) {
				console.error(err);
				return reject(err);
			}
			client.query(query, params, function (err, res) {
				if (err) {
					console.error(err);
					return reject(err);
				}

				if (end) {
					client.end(function (err) {
						if (err) {
							console.error(err);
							return reject(err);
						}
						resolve(res);
					});
				} else {
					resolve(res);
				}
			});
		});
	});
};

const schemaQuery =
	`
	CREATE SCHEMA IF NOT EXISTS ${schema};
	CREATE TABLE IF NOT EXISTS ${schema}.user (
		id SERIAL PRIMARY KEY, name varchar(255) not null, email varchar(255) not null, password varchar(60) not null
	);
	CREATE UNIQUE INDEX IF NOT EXISTS uq_user_email ON ${schema}.user (email);
	`;

const sync = query(schemaQuery, [], true);

module.exports = {
	sync,
	query,
	schema,
};
