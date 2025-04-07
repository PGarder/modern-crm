const mongoose = require('mongoose');
const axios = require('axios');
const User = require('../models/User');
const Contact = require('../models/Contact');
const Lead = require('../models/Lead');
const Task = require('../models/Task');

const API_BASE_URL = 'http://localhost:5000/api';

const testCRM = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Test Authentication
        console.log('\nTesting Authentication...');
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'admin@test.com',
            password: 'password123'
        });
        const token = loginResponse.data.token;
        console.log('Authentication successful');

        // Test Contact Management
        console.log('\nTesting Contact Management...');
        const contactsResponse = await axios.get(`${API_BASE_URL}/contacts`, {
            headers: { 'x-auth-token': token }
        });
        console.log('Contacts retrieved:', contactsResponse.data.length);

        // Test Lead Management
        console.log('\nTesting Lead Management...');
        const leadsResponse = await axios.get(`${API_BASE_URL}/leads`, {
            headers: { 'x-auth-token': token }
        });
        console.log('Leads retrieved:', leadsResponse.data.length);

        // Test Task Management
        console.log('\nTesting Task Management...');
        const tasksResponse = await axios.get(`${API_BASE_URL}/tasks`, {
            headers: { 'x-auth-token': token }
        });
        console.log('Tasks retrieved:', tasksResponse.data.length);

        // Test Reporting
        console.log('\nTesting Reporting...');
        const reportsResponse = await axios.get(`${API_BASE_URL}/reports/kpi`, {
            headers: { 'x-auth-token': token }
        });
        console.log('KPI Report:', reportsResponse.data);

        // Test Integration
        console.log('\nTesting Integration...');
        const integrationResponse = await axios.get(`${API_BASE_URL}/integrations`, {
            headers: { 'x-auth-token': token }
        });
        console.log('Integrations retrieved:', integrationResponse.data.length);

        // Test Data Validation
        console.log('\nTesting Data Validation...');
        const contact = await Contact.findOne({ email: 'john.doe@company.com' });
        console.log('Contact validation:', {
            score: contact.score,
            category: contact.category,
            status: contact.status
        });

        const lead = await Lead.findOne({ name: 'Enterprise Software Deal' });
        console.log('Lead validation:', {
            stage: lead.stage,
            probability: lead.probability,
            weightedValue: lead.weightedValue
        });

        console.log('\nAll tests completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error during testing:', error.message);
        process.exit(1);
    }
};

testCRM(); 