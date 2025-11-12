const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    
    const query = { recipient: req.user._id };
    if (type) query.type = type;
    if (status) query.status = status;

    const startIndex = (Number.parseInt(page, 10) - 1) * Number.parseInt(limit, 10);
    const total = await Notification.countDocuments(query);

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(Number.parseInt(limit, 10))
      .skip(startIndex)
      .populate('sender', 'firstName lastName');

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      status: { $in: ['pending', 'sent', 'delivered'] }
    });

    res.json({
      success: true,
      count: notifications.length,
      total,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read'
    });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
router.put('/mark-all-read', authenticate, async (req, res) => {
  try {
    await Notification.updateMany(
      { 
        recipient: req.user._id,
        status: { $in: ['pending', 'sent', 'delivered'] }
      },
      { 
        status: 'read',
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notifications as read'
    });
  }
});

module.exports = router;