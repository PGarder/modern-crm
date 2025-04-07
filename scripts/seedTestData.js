const mongoose = require('mongoose');
const User = require('../models/User');
const Contact = require('../models/Contact');
const Lead = require('../models/Lead');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');

const seedTestData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Create test users
        const users = [
            {
                name: 'Admin User',
                email: 'admin@test.com',
                password: await bcrypt.hash('password123', 10),
                role: 'admin'
            },
            {
                name: 'Sales Manager',
                email: 'manager@test.com',
                password: await bcrypt.hash('password123', 10),
                role: 'manager'
            },
            {
                name: 'Sales Rep',
                email: 'sales@test.com',
                password: await bcrypt.hash('password123', 10),
                role: 'user'
            }
        ];

        const createdUsers = await User.insertMany(users);
        console.log('Created test users');

        // Create test contacts
        const contacts = [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@company.com',
                phone: '555-0101',
                company: 'Tech Corp',
                title: 'CTO',
                status: 'active',
                source: 'website',
                score: 85,
                scoreFactors: {
                    engagement: 90,
                    revenue: 80,
                    activity: 85,
                    potential: 85
                },
                category: 'A',
                lastPurchaseDate: new Date('2023-12-15'),
                totalRevenue: 50000,
                averageOrderValue: 10000,
                purchaseFrequency: 5
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@enterprise.com',
                phone: '555-0102',
                company: 'Enterprise Solutions',
                title: 'VP of Sales',
                status: 'active',
                source: 'referral',
                score: 75,
                scoreFactors: {
                    engagement: 80,
                    revenue: 70,
                    activity: 75,
                    potential: 75
                },
                category: 'B',
                lastPurchaseDate: new Date('2023-11-20'),
                totalRevenue: 30000,
                averageOrderValue: 7500,
                purchaseFrequency: 4
            }
        ];

        const createdContacts = await Contact.insertMany(contacts);
        console.log('Created test contacts');

        // Create test leads
        const leads = [
            {
                name: 'Enterprise Software Deal',
                value: 75000,
                stage: 'proposal',
                status: 'active',
                probability: 70,
                source: 'website',
                dealType: 'new',
                territory: 'North America',
                weightedValue: 52500,
                contact: createdContacts[0]._id,
                assignedTo: createdUsers[2]._id
            },
            {
                name: 'Service Contract Renewal',
                value: 50000,
                stage: 'negotiation',
                status: 'active',
                probability: 80,
                source: 'existing',
                dealType: 'renewal',
                territory: 'North America',
                weightedValue: 40000,
                contact: createdContacts[1]._id,
                assignedTo: createdUsers[2]._id
            }
        ];

        const createdLeads = await Lead.insertMany(leads);
        console.log('Created test leads');

        // Create test tasks
        const tasks = [
            {
                title: 'Follow up on proposal',
                description: 'Call John to discuss the proposal details',
                dueDate: new Date('2024-02-20'),
                priority: 'high',
                status: 'pending',
                assignedTo: createdUsers[2]._id,
                relatedTo: {
                    type: 'lead',
                    id: createdLeads[0]._id
                }
            },
            {
                title: 'Schedule renewal meeting',
                description: 'Set up a meeting with Jane to discuss contract renewal',
                dueDate: new Date('2024-02-25'),
                priority: 'medium',
                status: 'pending',
                assignedTo: createdUsers[2]._id,
                relatedTo: {
                    type: 'lead',
                    id: createdLeads[1]._id
                }
            }
        ];

        await Task.insertMany(tasks);
        console.log('Created test tasks');

        console.log('Test data seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding test data:', error);
        process.exit(1);
    }
};

seedTestData(); 