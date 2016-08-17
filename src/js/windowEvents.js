var listeners = {};

exports.dispatchEvent = function(name, data) {
	for (var i = 0; i < listeners[name].length; i++) {
		listeners[name][i](data);
	}
};

exports.on = function(name, callback) {
	if (!listeners[name]) {
		listeners[name] = [];
	}
	listeners[name].push(callback);
};

document.addEventListener('DOMContentLoaded', function(e) {
	exports.dispatchEvent('documentReady', e);
});
