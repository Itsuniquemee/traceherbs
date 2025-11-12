const express = require('express');
const router = express.Router();
const { authenticate, authorize, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const Batch = require('../models/Batch');
const Document = require('../models/Document');
const Notification = require('../models/Notification');

// @desc    Get users pending approval
// @route   GET /api/admin/pending-users
// @access  Private (Admin)
router.get('/pending-users', authenticate, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const query = { isApproved: false };
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { username: new RegExp(search, 'i') }
      ];
    }

    const startIndex = (Number.parseInt(page, 10) - 1) * Number.parseInt(limit, 10);
    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(Number.parseInt(limit, 10))
      .skip(startIndex);

    res.json({ success: true, count: users.length, total, data: users });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ success: false, message: 'Error fetching pending users' });
  }
});

// @desc    Approve a pending user
// @route   PUT /api/admin/users/:id/approve
// @access  Private (Admin)
router.put('/users/:id/approve', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.isApproved) {
      return res.json({ success: true, message: 'User already approved', data: user });
    }

    user.isApproved = true;
    await user.save();

    // Create notification for the user
    try {
      await Notification.createNotification({
        recipient: user._id,
        sender: req.user._id,
        title: 'Account Approved',
        message: 'Your account has been approved by the administrator. You can now log in.',
        type: 'system_update',
        priority: 'high',
        relatedEntity: { entityType: 'user', entityId: user._id },
        channels: { inApp: true, email: false }
      });
    } catch (notifyErr) {
      console.error('Failed to create approval notification:', notifyErr);
    }

    res.json({ success: true, message: 'User approved successfully', data: user });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ success: false, message: 'Error approving user' });
  }
});

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get('/dashboard', authenticate, adminOnly, async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Batch statistics
    const totalBatches = await Batch.countDocuments();
    const batchesByStatus = await Batch.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent activities
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName role createdAt');
    const recentBatches = await Batch.find().sort({ createdAt: -1 }).limit(5).select('batchId product.name farmer.farmerName status createdAt');

    // System metrics
    const systemMetrics = {
      totalDocuments: await Document.countDocuments(),
      pendingNotifications: await Notification.countDocuments({ status: 'pending' }),
      qualityTestsToday: await Batch.countDocuments({
        'qualityTests.testDate': {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      })
    };

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, active: activeUsers, byRole: usersByRole },
        batches: { total: totalBatches, byStatus: batchesByStatus },
        recentActivities: { users: recentUsers, batches: recentBatches },
        systemMetrics
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
  }
});

// @desc    Get all users with pagination and filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
router.get('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { username: new RegExp(search, 'i') }
      ];
    }

    const startIndex = (Number.parseInt(page, 10) - 1) * Number.parseInt(limit, 10);
    const total = await User.countDocuments(query);
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(Number.parseInt(limit, 10))
      .skip(startIndex);

    res.json({
      success: true,
      count: users.length,
      total,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
router.put('/users/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User status updated', data: user });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ success: false, message: 'Error updating user status' });
  }
});

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
router.get('/analytics', authenticate, adminOnly, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // User growth analytics
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Batch creation analytics
    const batchAnalytics = await Batch.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          newBatches: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Quality test analytics
    const qualityAnalytics = await Batch.aggregate([
      { $unwind: '$qualityTests' },
      { $match: { 'qualityTests.testDate': { $gte: startDate } } },
      {
        $group: {
          _id: '$qualityTests.results.status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        userGrowth,
        batchAnalytics,
        qualityAnalytics,
        period
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching analytics' });
  }
});

// @desc    Get system logs
// @route   GET /api/admin/logs
// @access  Private (Admin)
router.get('/logs', authenticate, adminOnly, async (req, res) => {
  try {
    // In a real system, you'd fetch from your logging system
    const logs = [
      { timestamp: new Date(), level: 'info', message: 'System running normally', service: 'api' },
      { timestamp: new Date(), level: 'warn', message: 'High memory usage detected', service: 'database' }
    ];

    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ success: false, message: 'Error fetching logs' });
  }
});

// @desc    Send system notification
// @route   POST /api/admin/notifications
// @access  Private (Admin)
router.post('/notifications', authenticate, adminOnly, async (req, res) => {
  try {
    const { title, message, recipients, type = 'system_update', priority = 'medium' } = req.body;

    // Create notifications for specified recipients
    const notifications = [];
    
    if (recipients === 'all') {
      const users = await User.find({ isActive: true }).select('_id');
      for (const user of users) {
        notifications.push({
          recipient: user._id,
          sender: req.user._id,
          title,
          message,
          type,
          priority
        });
      }
    } else if (Array.isArray(recipients)) {
      for (const userId of recipients) {
        notifications.push({
          recipient: userId,
          sender: req.user._id,
          title,
          message,
          type,
          priority
        });
      }
    }

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: 'Notifications sent successfully',
      count: notifications.length
    });
  } catch (error) {
    console.error('Send notifications error:', error);
    res.status(500).json({ success: false, message: 'Error sending notifications' });
  }
});

module.exports = router;