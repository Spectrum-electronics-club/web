const url = 'https://spectrum-4qtx.onrender.com/api/v1/auth/login';
const data = {
  email: 'spectrum@ddu.ac.in',
  password: 'Spect@admin'
};

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.json().then(body => ({ status: res.status, body })))
.then(result => {
  console.log('Login Response Status:', result.status);
  console.log('Login Response Body:', result.body);
})
.catch(err => console.error('Fetch error:', err));
