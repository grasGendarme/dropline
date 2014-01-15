'use strict';

var koa = require('koa');
var app = koa();

var messages = require('./lib/messages.js');
var newContent = require('./routes/new.js')

var _ = require('underscore');
var fs = require('fs');
var mainPageTemplate = fs.readFileSync('templates/index._', 'utf8');
var html;
function renderTemplate() {
  html = _.template(mainPageTemplate, {'messages': messages.latests});
}

messages.onUpdate(renderTemplate);
renderTemplate();

function *responseTime(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
}

app.use(function *contentLength(next){
  yield next;
  if (!this.body) return;
  this.set('Content-Length', Buffer.byteLength(this.body));
});

app.use(newContent);

// Show the main page
app.use(function *mainPage(next){
  if ('/' !== this.url) {
    yield next;
	return;
  }
  this.set('Content-Type', 'text/html');
  this.status = 200;
  this.body = html;
});

app.use(function *API(next) {
  if ('/API' !== this.url) {
    yield next;
    return;
  }
  this.set('Content-Type', 'application/json');
  this.body = JSON.stringify(messages.latests, null, 2);
});

app.use(function *notFoundHandler() {
  this.status = 404;
  this.body = 'Not found';
  this.set('Content-Type', 'text/plain');
});

var port = process.env.PORT || 8888;
app.listen(port);
console.log('App launched on port', port);

