const mongoose = require('mongoose');
const User = require('./src/models/User');

const MONGO_URI = process.argv[2];

if (!MONGO_URI) {
  console.log('Please provide your Live MongoDB URI');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('\n✅ Connected to Live Database!');
    
    const users = await User.find({});
    console.log(`\nFound ${users.length} users in the database:`);
    users.forEach(u => console.log(`- Email: "${u.email}", Role: ${u.role}, Username: ${u.username}`));
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
