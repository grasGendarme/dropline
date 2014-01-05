var messages = require('../lib/messages.js');
var _ = require('underscore');

module.exports = function *newContentHandler(next) {
	if ('/new' == this.path) {
		if (this.query && this.query.content) {
		  messages.push(_.escape(this.query.content));
		  this.status = 200;
		} else {
		  this.body = 'Invalid request';
		  this.status = 400;
		}
		this.redirect('/');
		return;
	}
	yield next;
};