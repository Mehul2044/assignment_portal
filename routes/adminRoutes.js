const express = require('express');
const router = express.Router();

const {register, login, getAssignments, acceptAssignment, rejectAssignment} = require('../controllers/adminController');
const {authenticate, authorizeRole} = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/assignments', authenticate, authorizeRole('Admin'), getAssignments);
router.post('/assignments/:id/accept', authenticate, authorizeRole('Admin'), acceptAssignment);
router.post('/assignments/:id/reject', authenticate, authorizeRole('Admin'), rejectAssignment);

module.exports = router;
