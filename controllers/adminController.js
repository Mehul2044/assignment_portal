const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Assignment = require('../models/assignment');
const User = require("../models/user");

const {successResponse, errorResponse} = require('../utils/response');
const logger = require('../utils/logger');
const {validateUsername, validatePassword} = require("../utils/validation");


/**
 * Registers a new admin user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {string} req.body.username - The username of the admin to be registered.
 * @param {string} req.body.password - The plaintext password of the admin to be registered.
 *
 * If the registration is successful, a 201 Created response is sent with the newly registered user's data.
 * If an error occurs during the process, a 500 Internal Server Error response is sent with an error message.
 */
exports.register = async (req, res) => {
    const {username, password} = req.body;
    try {
        validateUsername(username);
        validatePassword(password);
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

/**
 * Authenticates an admin user and generates a JWT token for session management.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {string} req.body.username - The username of the admin attempting to log in.
 * @param {string} req.body.password - The plaintext password of the admin.
 * @returns {Promise<void>} Resolves when the admin is successfully authenticated, rejects if authentication fails.
 *
 * If the login is successful, a JSON response with a token is sent.
 * If the login fails due to invalid credentials, a 401 Unauthorized response is sent.
 * If an error occurs during the process, a 500 Internal Server Error response is sent with an error message.
 */
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

/**
 * Retrieves all assignments assigned to the current admin user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 *
 * If the assignments are successfully retrieved, a JSON response with a 200 status code is sent.
 * If an error occurs during the process, a 500 Internal Server Error response is sent with an error message.
 */
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

/**
 * Accepts an assignment by updating its status to 'Accepted'.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {string} req.params.id - The ID of the assignment to be accepted.
 *
 * If the acceptance is successful, a JSON response with a 200 status code is sent.
 * If an error occurs during the process, a 500 Internal Server Error response is sent with an error message.
 */
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

/**
 * Rejects an assignment by updating its status to 'Rejected'.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {string} req.params.id - The ID of the assignment to be rejected.
 *
 * If the rejection is successful, a JSON response with a 200 status code is sent.
 * If an error occurs during the process, a 500 Internal Server Error response is sent with an error message.
 */
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
