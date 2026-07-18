const fs = require('fs');
const t = fs.readFileSync('swagger-ui-init.js', 'utf8');
const start = t.indexOf('"swaggerDoc": ');
if (start > 0) {
  const end = t.indexOf(',\n  "customOptions"');
  if (end > 0) {
    fs.writeFileSync('api.json', t.substring(start + 14, end));
    console.log('Wrote api.json');
  } else {
    console.log('customOptions not found');
  }
} else {
  console.log('swaggerDoc not found');
}
