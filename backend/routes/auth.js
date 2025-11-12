const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName')
    .notEmpty()
    .trim()
    .withMessage('First name is required'),
  body('lastName')
    .notEmpty()
    .trim()
    .withMessage('Last name is required'),
  body('role')
    .isIn(['farmer', 'processor', 'consumer', 'regulator'])
    .withMessage('Invalid role selected')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

  const { username, email, password, firstName, lastName, role, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email ? 
          'Email already registered' : 
          'Username already taken'
      });
    }

    // Determine approval: consumers are auto-approved, other roles require admin approval
    const requiresApproval = role && role !== 'consumer';

    // Create user (mark isApproved accordingly)
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      address,
      isApproved: !requiresApproval
    });

    // Generate JWT token
    const token = user.getSignedJwtToken();

    // Remove password from response
    user.password = undefined;

    // If the user requires admin approval, notify admins
    if (requiresApproval) {
      try {
        const admins = await User.find({ role: 'admin' }).select('_id email firstName lastName');
        const notifications = admins.map(a => ({
          recipient: a._id,
          sender: user._id,
          title: 'New user awaiting approval',
          message: `${user.fullName} (${user.email}) has registered as ${user.role} and requires your approval.`,
          type: 'system_update',
          priority: 'high',
          relatedEntity: { entityType: 'user', entityId: user._id },
          channels: { inApp: true, email: false }
        }));

        if (notifications.length) await Notification.insertMany(notifications);
      } catch (notifyErr) {
        console.error('Failed to notify admins about pending approval:', notifyErr);
      }
    }

    res.status(201).json({
      success: true,
      message: requiresApproval ? 'Registration submitted and pending admin approval' : 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        isApproved: user.isApproved,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Authenticate user
    const result = await User.getAuthenticated(email, password);

    if (result.reason) {
      let message = 'Invalid credentials';
      let statusCode = 401;

      switch (result.reason) {
        case 'User not found':
          message = 'No account found with this email';
          statusCode = 404;
          break;
        case 'Account locked':
          message = 'Account temporarily locked due to too many failed login attempts';
          statusCode = 423;
          break;
        case 'Invalid credentials':
          message = 'Invalid email or password';
          statusCode = 401;
          break;
      }

      return res.status(statusCode).json({
        success: false,
        message
      });
    }

    const { user } = result;

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Check if user is approved by admin (for non-consumer roles)
    if (typeof user.isApproved !== 'undefined' && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Account awaiting admin approval. You will be notified once approved.'
      });
    }

    // Generate JWT token
    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
        profilePicture: user.profilePicture,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @desc    Get current user info
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
        isActive: user.isActive,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
        preferences: user.preferences,
        farmerProfile: user.farmerProfile,
        processorProfile: user.processorProfile,
        consumerProfile: user.consumerProfile,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user info'
    });
  }
});

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Email configuration (you'll need to set up your email service)
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your HerbalTrace account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background: #2c7744; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    try {
      await transporter.sendMail({
        from: `HerbalTrace <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Reset Request',
        html: message
      });

      res.json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      
      // Clear reset token fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing forgot password request'
    });
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:resettoken
// @access  Public
router.post('/reset-password/:resettoken', [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Password validation failed',
        errors: errors.array()
      });
    }

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    // Generate new JWT token
    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      message: 'Password reset successful',
      token
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password'
    });
  }
});

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
router.post('/change-password', authenticate, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
});

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error verifying email'
    });
  }
});

module.exports = router;