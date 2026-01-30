const url = 'https://script.google.com/macros/s/AKfycbzNmRQ1QxzYqsKprHPGDGJg47aCABDJ2wr1JLpnzNZR0ZOPRDZNhb6dlqqW3ElyBAJy/exec?action=getData';
const proxy = 'http://localhost:3000/api/proxy?url=' + encodeURIComponent(url);

console.log('Fetching Profile Data via Proxy...');

fetch(proxy)
.then(res => res.json())
.then(data => {
  console.log('Profile Data:', JSON.stringify(data.profile, null, 2));
})
.catch(err => console.error('Fetch Error:', err));
