const maxMessages = 10;
var messages = ['Hey', 'This is a new instance!'];

Object.defineProperty(module.exports, 'latests', {
    get: function() {
      return messages;
    },
    set: function() {
      throw 'Don\'t replace the array, use .push() instead';
    }
});

module.exports.push = function push(msg) {
  messages.unshift(msg);
  messages.length = maxMessages <= messages.length ? maxMessages:messages.length;  
};