const jwt = require('jsonwebtoken');
const {errorResponse} = require('../utils/response');
const express = require('express');


/**
 * Middleware to authenticate a user based on their JWT token.
 *
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {Function} next - The next middleware or route handler in the stack.
 *
 * If the request does not contain a JWT token in the Authorization header, a 401 Unauthorized response is sent.
 * If the JWT token is invalid, a 403 Forbidden response is sent.
 * Otherwise, the request proceeds to the next middleware or route handler, with the user data stored in `req.user`.
 */
exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json(errorResponse('Access denied'));
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(403).json(errorResponse('Invalid token', error));
    }
};

/**
 * Middleware to authorize a user based on their role.
 *
 * @param {string} role - The required role for access.
 * @returns {Function} Middleware function that checks the user's role.
 *
 * If the user's role does not match the required role, a 403 Unauthorized response is sent.
 * Otherwise, the request proceeds to the next middleware or route handler.
 */
exports.authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json(errorResponse('Unauthorized role'));
    next();
};
