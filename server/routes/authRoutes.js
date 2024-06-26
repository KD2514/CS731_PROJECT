const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const studentController = require("../controllers/studentController");

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/students', studentController.getStudents);

module.exports = router;
