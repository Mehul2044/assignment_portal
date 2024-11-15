/**
 * Creates a success response object.
 * @param {string} message - The success message
 * @param {Object} [data] - The data to be sent with the response (optional)
 * @returns {Object} A success response object
 */
exports.successResponse = (message, data = {}) => ({ success: true, message, data });
/**
 * Creates an error response object.
 * @param {string} message - The error message
 * @param {Error} [error] - The error object (optional)
 * @returns {Object} An error response object
 */
exports.errorResponse = (message, error = null) => ({ success: false, message, error });
