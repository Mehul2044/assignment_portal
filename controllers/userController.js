const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Assignment = require('../models/assignment');

const {successResponse, errorResponse} = require('../utils/response');
const logger = require('../utils/logger');
const {validateUsername, validatePassword} = require("../utils/validation");


/**
 * Registers a new user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {string} req.body.username - The username of the user to be registered.
 * @param {string} req.body.password - The plaintext password of the user to be registered.
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
        const user = new User({username, password: hashedPassword, role: 'User'});
        await user.save();
        logger.info(`User ${user.username} registered`);
        res.status(201).json(successResponse('User registered successfully', user));
    } catch (error) {
        logger.error(`Registration failed: ${error}`);
        res.status(500).json(errorResponse('Registration failed', error));
    }
};

/**
 * Authenticates a user and generates a JWT token for session management.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {string} req.body.username - The username of the user attempting to log in.
 * @param {string} req.body.password - The plaintext password of the user.
 * @returns {Promise<void>} Resolves when the user is successfully authenticated, rejects if authentication fails.
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
        const token = jwt.sign({id: user._id, role: 'User'}, process.env.JWT_SECRET);
        logger.info(`User ${user.username} logged in`);
        res.json(successResponse('Login successful', {token}));
    } catch (error) {
        logger.error(`Login failed: ${error}`);
        res.status(500).json(errorResponse('Login failed', error));
    }
};

/**
 * Creates a new assignment and saves it to the database.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {string} req.body.task - The task to be assigned.
 * @param {string} req.body.admin - The admin to assign the task to.
 *
 * If the assignment is successfully uploaded, a JSON response with a 201 status code is sent.
 * If an error occurs during the process, a 500 Internal Server Error response is sent with an error message.
 */
exports.uploadAssignment = async (req, res) => {
    const {task, adminId} = req.body;
    try {
        const assignment = new Assignment({userId: req.user.id, task, adminId});
        await assignment.save();
        logger.info(`Assignment uploaded by ${req.user.username}`);
        res.status(201).json(successResponse('Assignment uploaded', assignment));
    } catch (error) {
        logger.error(`Failed to upload assignment: ${error}`);
        res.status(500).json(errorResponse('Failed to upload assignment', error));
    }
};

/**
 * Retrieves all users with the role 'Admin'.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 *
 * If the admins are successfully retrieved, a JSON response with a 200 status code is sent.
 * If an error occurs during the process, a 500 Internal Server Error response is sent with an error message.
 */
exports.getAdmins = async (req, res) => {
    try {
        const admins = await User.find({role: 'Admin'});
        logger.info('Admins retrieved');
        res.json(successResponse('Admins retrieved', admins));
    } catch (error) {
        logger.error(`Failed to get admins: ${error}`);
        res.status(500).json(errorResponse('Failed to get admins', error));
    }
};
