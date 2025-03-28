const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  telegram: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  accessCode: {
    type: String,
    required: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  codeEmailScheduled: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Registration', registrationSchema);