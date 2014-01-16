var messages = require('../lib/messages.js');
var _ = require('underscore');

var MAXMESSAGELENGTH = 160;

module.exports = function *newContentHandler(next) {
	if ('/new' == this.path) {
		if (this.query && this.query.content) {
      if(this.query.content.length < MAXMESSAGELENGTH) {
		    messages.push(_.escape(this.query.content), new Date());
		    this.status = 200;
      } else {
        this.body = 'Message too large';
        this.status = 400;
        return;
      }
		} else {
		  this.body = 'Invalid request';
		  this.status = 400;
		}
		this.redirect('/');
		return;
	}
	yield next;
};