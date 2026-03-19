const mongoose = require('mongoose');

module.exports = async function connect() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stem';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
  });
  console.log('MongoDB connected');
};