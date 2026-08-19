const fs = require('fs');
['public/js/app.js', 'server.js', 'db/supabase.js'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/'00'/g, "'0'");
  fs.writeFileSync(f, c);
});
