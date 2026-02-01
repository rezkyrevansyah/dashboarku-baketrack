const https = require('https');

const url = 'https://script.google.com';

console.log('Testing connectivity to ' + url);

https.get(url, (res) => {
  console.log('StatusCode:', res.statusCode);
  console.log('Headers:', res.headers);
  
  res.on('data', (d) => {
    // process.stdout.write(d);
  });
  
  res.on('end', () => {
     console.log('Request finished');
  });

}).on('error', (e) => {
  console.error('Error:', e);
});
