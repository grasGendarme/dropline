var messages = require('../lib/messages.js');
var _ = require('underscore');

var MAXMESSAGELENGTH = 160;

module.exports = function *newContentHandler(next) {
	if ('/new' == this.path) {
		if (this.query && this.query.content) {
        if(this.query.content.length < MAXMESSAGELENGTH) {
        this.query.content = _.escape(this.query.content);
        // regex magic to parse links posted
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        this.query.content = this.query.content.replace(exp,"<a href='$1' rel=\"nofollow\">$1</a>"); 
		    messages.push(this.query.content, new Date());
		    this.status = 303;
        this.set('Location', '/');
        return;
      } else {
        this.body = 'Message too large';
        this.status = 400;
        return;
      }
		} else {
		  this.body = 'Invalid request';
		  this.status = 400;
		}
    return;
	}
	yield next;
};