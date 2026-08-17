const serverless = require('serverless-http');
const app = require('../server');

const serverlessHandler = serverless(app, {
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

exports.handler = async (event, context) => {
  // Prevent Lambda from hanging on open database connections/timers
  if (context) {
    context.callbackWaitsForEmptyEventLoop = false;
  }
  try {
    return await serverlessHandler(event, context);
  } catch (err) {
    console.error('Netlify Function error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: err.message || 'Internal Serverless Error' })
    };
  }
};
