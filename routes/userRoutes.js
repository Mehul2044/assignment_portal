const express = require('express');
const router = express.Router();

const { register, login, uploadAssignment, getAdmins } = require('../controllers/userController');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/upload', authenticate, authorizeRole('User'), uploadAssignment);
router.get('/admins', authenticate, getAdmins);

module.exports = router;
