'use strict';

var serve = require('koa-static');
var compress = require('koa-compress')
var koa = require('koa');
var app = koa();

var moment = require('moment')

var messages = require('./lib/messages.js');
var newContent = require('./routes/new.js')

var _ = require('underscore');
var fs = require('fs');
var mainPageTemplate = fs.readFileSync('templates/index._', 'utf8');
var html;
function renderTemplate() {
  function formatDate(msg) {
    return {
      message: msg.message,
      date: moment(msg.date).fromNow()
    };
  }
  html = _.template(mainPageTemplate, {'messages': _.map(messages.latests, formatDate)});
}

messages.onUpdate(renderTemplate);
renderTemplate();

function *responseTime(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
}

app.use(compress());

app.use(serve(__dirname + '/assets'));

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
  if ('/api' !== this.url.toLowerCase()) {
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

