require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({message: "Server Up!"});
});

app.get("/api", (req, res) => {
    logger.info("Assignment Portal API");
    res.status(200).json({message: "Assignment Portal API"});
});

app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("*", (req, res) => {
    res.status(404).json({message: "Endpoint Not Found"});
});


app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}.\nTo access locally, use http://localhost:${PORT}`);
});
