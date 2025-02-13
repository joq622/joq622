module.exports = (app) => {
  // Listen for new issues being opened
  app.on('issues.opened', async (context) => {
    // Respond to the issue with a comment
    const issueComment = context.issue({ body: 'Hello! Thanks for opening this issue.' });
    await context.github.issues.createComment(issueComment);
  });
};
