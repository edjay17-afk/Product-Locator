const serverless = require('serverless-http');
const app = require('../server');

// Wrap Express app for Netlify Serverless Functions
const handler = serverless(app, {
  request(request, event) {
    let targetPath = event.path || '';
    if (targetPath.startsWith('/.netlify/functions/api')) {
      const sub = targetPath.replace(/^\/\.netlify\/functions\/api/, '');
      targetPath = '/api' + (sub ? (sub.startsWith('/') ? sub : '/' + sub) : '');
    } else if (!targetPath.startsWith('/api')) {
      targetPath = '/api' + (targetPath.startsWith('/') ? targetPath : '/' + targetPath);
    }
    const query = event.rawQuery ? '?' + event.rawQuery : '';
    request.url = targetPath + query;
  }
});

module.exports = { handler };
module.exports.handler = handler;
