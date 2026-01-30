const formData = new FormData();
formData.append('action', 'manageProduct');
formData.append('subAction', 'create');
formData.append('id', Date.now().toString());
formData.append('name', 'Test Product Node');
formData.append('price', '15000');
formData.append('stock', '20');
formData.append('image', '🧪');

console.log('Testing Proxy POST...');

fetch('http://localhost:3000/api/proxy?url=' + encodeURIComponent('https://script.google.com/macros/s/AKfycbzNmRQ1QxzYqsKprHPGDGJg47aCABDJ2wr1JLpnzNZR0ZOPRDZNhb6dlqqW3ElyBAJy/exec'), {
  method: 'POST',
  body: formData
})
.then(res => res.text()) // Get text first to see if it's JSON or HTML error
.then(text => {
  console.log('Response Status:', 200); // fetch doesn't throw on 400/500, but we can check res.ok if we had the object
  try {
    const json = JSON.parse(text);
    console.log('JSON Response:', JSON.stringify(json, null, 2));
  } catch (e) {
    console.log('Raw Response:', text);
  }
})
.catch(err => console.error('Fetch Error:', err));
