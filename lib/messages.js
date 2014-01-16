'use strict';

var _ = require('underscore');

const MAXMESSAGES = 10;
var messages = [{message:'Hey', date: new Date()}];
var updateCallbacks = [];

Object.defineProperty(module.exports, 'latests', {
    get: function() {
      return messages;
    },
    set: function() {
      throw 'Don\'t replace the array, use .push() instead';
    }
});

module.exports.push = function push(msg, date) {
  if (typeof 'msg' !== 'string') throw 'msg should be a string';
  messages.unshift({message: msg, date:date});
  messages.length = MAXMESSAGES <= messages.length ? MAXMESSAGES:messages.length;
  for(var i = 0; i < updateCallbacks.length; i++) {
    updateCallbacks[i]();
  }
};

module.exports.onUpdate = function(fun) {
  if (_.isFunction(fun)) {
    updateCallbacks.push(fun);
  }
}