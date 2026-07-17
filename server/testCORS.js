const url = 'https://spectrum-4qtx.onrender.com/api/v1/health';

fetch(url, {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://client-two-eta-40.vercel.app',
    'Access-Control-Request-Method': 'POST'
  }
})
.then(res => {
  console.log('Status:', res.status);
  console.log('Access-Control-Allow-Origin:', res.headers.get('access-control-allow-origin'));
  console.log('Access-Control-Allow-Credentials:', res.headers.get('access-control-allow-credentials'));
})
.catch(err => console.error('Error:', err));
