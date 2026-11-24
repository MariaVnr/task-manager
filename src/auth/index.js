function getCurrentUserId(session) {
  return session ? session.userId : null;
}

module.exports = { getCurrentUserId };
