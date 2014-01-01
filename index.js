var koa = require('koa');
var app = koa();

var fs = require('fs');
var beginHTML = fs.readFileSync('views/begin.html');
var endHTML = fs.readFileSync('views/end.html');

var encode = new (require('html-entities').AllHtmlEntities)().encode;

const maxMessages = 10;
var messages = ['Hey', 'This is a new instance!'];

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


app.use(function *newContentHandler(next) {
	if ('/new' == this.path) {
		if (this.query && this.query.content) {
		  messages.unshift(encode(this.query.content));
		  messages.length = maxMessages <= messages.length ? maxMessages:messages.length;
		  this.status = 200;
		} else {
		  this.body('Invalid request')
		  this.status = 400;
		}
		this.redirect('/');
		return;
	}
	yield next;
});

// Show the main page
app.use(function *mainPage(next){
  if ('/' !== this.url) {
    yield next;
	return;
  }
  this.set('Content-Type', 'text/html');
  this.status = 200;
  
  body = beginHTML;
  for (var i = 0; i < messages.length; i++) {
    body += '<br>' + messages[i];		  
  }
  body += endHTML;
  this.body = body;
});

app.use(function *notFoundHandler() {
  this.status = 404;
  this.body = 'Not found';
  this.set('Content-Type', 'text/plain');
});

var port = process.env.PORT || 8888;
app.listen(port);
console.log('App launched on port', port);

