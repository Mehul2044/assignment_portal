/**
 * Validates a given username against a set of constraints.
 *
 * The constraints are:
 *  - Length between 3 and 20 characters (inclusive)
 *  - Pattern of only alphanumeric characters and underscores
 *
 * If the username does not meet any of the above constraints, an Error is thrown.
 *
 * @param {string} username - The username to validate.
 * @throws {Error} If the username is invalid.
 */
const validateUsername = (username) => {
    const usernameConstraints = {
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
    };

    if (!username || username.length < usernameConstraints.minLength || username.length > usernameConstraints.maxLength || !usernameConstraints.pattern.test(username)) {
        throw new Error('Invalid username');
    }
};

/**
 * Validates a given password against a set of constraints.
 *
 * The constraints are:
 *  - Length between 8 and 50 characters (inclusive)
 *  - Pattern of at least one lowercase letter, one uppercase letter, one digit and one special character
 *
 * If the password does not meet any of the above constraints, an Error is thrown.
 *
 * @param {string} password - The password to validate.
 * @throws {Error} If the password is invalid.
 */
const validatePassword = (password) => {
    const passwordConstraints = {
        minLength: 8,
        maxLength: 50,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    };

    if (!password || password.length < passwordConstraints.minLength || password.length > passwordConstraints.maxLength || !passwordConstraints.pattern.test(password)) {
        throw new Error('Invalid password');
    }
};

module.exports = {validateUsername, validatePassword};