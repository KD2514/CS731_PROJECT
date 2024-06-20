const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateUser, authorizeRoles } = require('../middleware/authenticateUser');

router.get('/:courseId', authenticateUser,authorizeRoles('student'), chatController.getChatByCourseId);

module.exports = router;
