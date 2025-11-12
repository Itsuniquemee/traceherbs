const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: ['farmer', 'processor', 'consumer', 'admin', 'regulator'],
    default: 'consumer'
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  profilePicture: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Whether the account has been approved by an administrator
  isApproved: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  // Role-specific fields
  farmerProfile: {
    farmName: String,
    farmSize: Number, // in acres
    farmingType: {
      type: String,
      enum: ['organic', 'conventional', 'sustainable']
    },
    certifications: [String],
    specializations: [String], // herbs/crops they specialize in
    experienceYears: Number,
    registrationNumber: String
  },
  processorProfile: {
    companyName: String,
    facilityType: {
      type: String,
      enum: ['processing', 'packaging', 'manufacturing', 'distribution']
    },
    capacity: Number,
    certifications: [String],
    licenseNumber: String,
    processingMethods: [String]
  },
  consumerProfile: {
    preferences: [String],
    allergies: [String],
    interests: [String]
  },
  // Security and preferences
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' },
    theme: { type: String, default: 'light' }
  },
  // Tracking fields
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationToken: String,
  verificationTokenExpire: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's been modified
  if (!this.isModified('password')) {
    next();
  }

  // Hash password with cost of 12
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      role: this.role,
      username: this.username 
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

// Method to generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  // Generate random token
  const resetToken = require('crypto').randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Method to check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }

  return this.updateOne(updates);
};

// Static method to find user by credentials
userSchema.statics.getAuthenticated = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  
  if (!user) {
    return { reason: 'User not found' };
  }

  // Check if account is locked
  if (user.isLocked()) {
    return user.incLoginAttempts().then(() => {
      return { reason: 'Account locked' };
    });
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  
  if (isMatch) {
    // Reset login attempts if successful
    if (user.loginAttempts > 0) {
      await user.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    return { user };
  }

  // Increment login attempts
  await user.incLoginAttempts();
  return { reason: 'Invalid credentials' };
};

module.exports = mongoose.model('User', userSchema);