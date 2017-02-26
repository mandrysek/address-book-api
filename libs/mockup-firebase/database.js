const Ref = require('./ref');

class Database {
	constructor() {
		this.refs = {};
	}

	ref(ref) {
		this.refs[ref] = new Ref(ref);
		return this.refs[ref];
	}
}

module.exports = new Database();
