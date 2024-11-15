
const User = require('../models/user');
const Assignment = require('../models/assignment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role: 'User' });
        await user.save();
        res.status(201).json(successResponse('User registered successfully', user));
    } catch (error) {
        res.status(500).json(errorResponse('Registration failed', error));
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json(errorResponse('Invalid credentials'));
        }
        const token = jwt.sign({ id: user._id, role: 'User' }, process.env.JWT_SECRET);
        logger.info(`User ${user.username} logged in`);
        res.json(successResponse('Login successful', { token }));
    } catch (error) {
        logger.error(`Login failed: ${error}`);
        res.status(500).json(errorResponse('Login failed', error));
    }
};

exports.uploadAssignment = async (req, res) => {
    const { task, admin } = req.body;
    try {
        const assignment = new Assignment({ userId: req.user.id, task, admin });
        await assignment.save();
        logger.info(`Assignment uploaded by ${req.user.username}`);
        res.status(201).json(successResponse('Assignment uploaded', assignment));
    } catch (error) {
        logger.error(`Failed to upload assignment: ${error}`);
        res.status(500).json(errorResponse('Failed to upload assignment', error));
    }
};

exports.getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'Admin' });
        logger.info('Admins retrieved');
        res.json(successResponse('Admins retrieved', admins));
    } catch (error) {
        logger.error(`Failed to get admins: ${error}`);
        res.status(500).json(errorResponse('Failed to get admins', error));
    }
};
