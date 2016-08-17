const Pair = require('./Pair');

class ContentNode extends Pair {
	constructor(key, value, parent) {
		super();
		this._isContent = true;
	}
}

module.exports = ContentNode;
