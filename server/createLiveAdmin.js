const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const MONGO_URI = process.argv[2];
const EMAIL = process.argv[3] || 'admin@spectrum.com';
const PASSWORD = process.argv[4] || 'SpectrumAdmin123!';

if (!MONGO_URI) {
  console.log('\n❌ ERROR: Please provide your Live MongoDB URI as the first argument.');
  console.log('Example: node createLiveAdmin.js "mongodb+srv://..." "admin@example.com" "mypassword"\n');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('\n✅ Connected to Live Database!');
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: EMAIL });
    if (existingAdmin) {
      console.log(`⚠️ Admin user ${EMAIL} already exists in the live database!`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(PASSWORD, salt);

    const newAdmin = new User({
      username: 'admin',
      email: EMAIL,
      passwordHash: passwordHash,
      role: 'admin'
    });

    await newAdmin.save();
    console.log(`\n🎉 Successfully created admin user in the LIVE database!`);
    console.log(`Email:    ${EMAIL}`);
    console.log(`Password: ${PASSWORD}`);
    console.log(`\nYou can now log into your live website using these credentials.\n`);
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Error connecting to MongoDB:', err);
    process.exit(1);
  });
