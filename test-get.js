const url = 'https://script.google.com/macros/s/AKfycbzNmRQ1QxzYqsKprHPGDGJg47aCABDJ2wr1JLpnzNZR0ZOPRDZNhb6dlqqW3ElyBAJy/exec?action=getData';
const proxy = 'http://localhost:3000/api/proxy?url=' + encodeURIComponent(url);

console.log('Fetching Data via Proxy...');

fetch(proxy)
.then(res => res.json())
.then(data => {
  console.log('Success!');
  if (data.products) {
    console.log('Products Count:', data.products.length);
    console.log('First 5 Products:', data.products.slice(0, 5));
    const testProd = data.products.find(p => p.name === 'Test Product Node');
    if (testProd) console.log('FOUND Test Product:', testProd);
    else console.log('Test Product Node NOT FOUND.');
  } else {
    console.log('Full Response Data:', JSON.stringify(data, null, 2));
  }
})
.catch(err => console.error('Fetch Error:', err));
