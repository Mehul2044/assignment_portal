const mongoose = require('mongoose');

/**
 * Establishes a connection to the MongoDB database.
 *
 * @function
 * @returns {Promise<void>} Resolves if the connection is successful, rejects if
 * the connection is unsuccessful.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
