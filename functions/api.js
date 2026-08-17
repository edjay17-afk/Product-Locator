const serverless = require('serverless-http');
const app = require('../server');

// Wrap the Express app as a Netlify serverless function.
// netlify.toml redirects /api/* → /.netlify/functions/api (full path preserved)
const handler = serverless(app, {
  request(request, event) {
    // Ensure the full original path (e.g. /api/auth/login) is used,
    // not the Netlify internal function path.
    request.url = event.path + (event.rawQuery ? '?' + event.rawQuery : '');
  }
});

module.exports = { handler };
