const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crm', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Basic Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Modern CRM API' });
});

// Import Routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const leadRoutes = require('./routes/leads');
const taskRoutes = require('./routes/tasks');
const reportRoutes = require('./routes/reports');
const integrationRoutes = require('./routes/integrations');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/integrations', integrationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 