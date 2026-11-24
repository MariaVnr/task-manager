const auth = require('./auth');
const tasks = require('./tasks');

function main() {
  return { auth, tasks };
}

module.exports = { main };
