const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

// @desc    Get all users (basic info)
// @route   GET /api/users
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { role, active } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (active !== undefined) query.isActive = active === 'true';

    const users = await User.find(query)
      .select('firstName lastName username email role isActive profilePicture')
      .sort({ firstName: 1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    // Users can only update their own profile unless they're admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const allowedUpdates = [
      'firstName', 'lastName', 'phone', 'address', 'profilePicture', 
      'preferences', 'farmerProfile', 'processorProfile', 'consumerProfile'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

module.exports = router;