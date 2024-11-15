const Assignment = require('../models/assignment');
const {successResponse, errorResponse} = require('../utils/response');
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const logger = require('../utils/logger');


exports.register = async (req, res) => {
    const {username, password} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({username, password: hashedPassword, role: 'Admin'});
        await user.save();
        logger.info(`Admin ${user.username} registered`);
        res.status(201).json(successResponse('User registered successfully', user));
    } catch (error) {
        logger.error(`Registration failed: ${error}`);
        res.status(500).json(errorResponse('Registration failed', error));
    }
};

exports.login = async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.findOne({username});
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json(errorResponse('Invalid credentials'));
        }
        const token = jwt.sign({id: user._id, role: 'Admin'}, process.env.JWT_SECRET);
        logger.info(`Admin ${user.username} logged in`);
        res.json(successResponse('Login successful', {token}));
    } catch (error) {
        logger.error(`Login failed: ${error}`);
        res.status(500).json(errorResponse('Login failed', error));
    }
};

exports.getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({admin: req.user.id}).populate('userId', 'username');
        logger.info('Assignments retrieved');
        res.json(successResponse('Assignments retrieved', assignments));
    } catch (error) {
        logger.error(`Failed to retrieve assignments: ${error}`);
        res.status(500).json(errorResponse('Failed to retrieve assignments', error));
    }
};

exports.acceptAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(req.params.id, {status: 'Accepted'}, {new: true});
        logger.info('Assignment accepted');
        res.json(successResponse('Assignment accepted', assignment));
    } catch (error) {
        logger.error(`Failed to accept assignment: ${error}`);
        res.status(500).json(errorResponse('Failed to accept assignment', error));
    }
};

exports.rejectAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(req.params.id, {status: 'Rejected'}, {new: true});
        logger.info('Assignment rejected');
        res.json(successResponse('Assignment rejected', assignment));
    } catch (error) {
        logger.error(`Failed to reject assignment: ${error}`);
        res.status(500).json(errorResponse('Failed to reject assignment', error));
    }
};
