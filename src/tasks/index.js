const { getCurrentUserId } = require('../auth');

function listTasksFor(session) {
  const userId = getCurrentUserId(session);
  if (userId === null) {
    throw new Error('Unauthorized');
  }
  return [];
}

module.exports = { listTasksFor };
