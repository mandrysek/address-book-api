class Ref {
	constructor(key) {
		this.key = key;
	}

	push() {
		this.list = [];
		return this;
	}

	set(data) {
		this.list.push(data);

		return Promise.resolve();
	}
}

module.exports = Ref;
