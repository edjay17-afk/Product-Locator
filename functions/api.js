const serverless = require('serverless-http');
const app = require('../server');

// Wrap the Express app as a Netlify serverless function.
// The /api/* -> /.netlify/functions/api/:splat redirect in netlify.toml
// routes all API calls here automatically.
module.exports.handler = serverless(app);
