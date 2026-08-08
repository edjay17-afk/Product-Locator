/**
 * Vercel Serverless Entry Point
 * Wraps the Express app with serverless-http so Vercel can call it as a Function.
 */
const serverlessHttp = require('serverless-http');
const app = require('../server');

module.exports = serverlessHttp(app);
