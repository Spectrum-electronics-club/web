const http = require('http');

const PORT = process.env.PORT || 5000;
const URL = `http://localhost:${PORT}/api/v1/projects`;

console.log(`Starting rate limit test on ${URL}...`);
console.log(`Expect the first 100 to succeed, and the 101st to fail with a 429 status code.\n`);

const makeRequest = (requestNumber) => {
  return new Promise((resolve) => {
    http.get(URL, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`[Request ${requestNumber}] Status: ${res.statusCode}`);
        
        if (res.statusCode === 429) {
          console.log(`   🚨 Rate limit hit! Response: ${data}`);
        }
        
        resolve();
      });
    }).on('error', (err) => {
      console.log(`[Request ${requestNumber}] Error: ${err.message}`);
      resolve();
    });
  });
};

async function runTest() {
  const requests = [];
  
  // Fire off 101 requests immediately
  for (let i = 1; i <= 101; i++) {
    requests.push(makeRequest(i));
  }

  await Promise.all(requests);
  console.log('\nTest complete!');
}

runTest();
