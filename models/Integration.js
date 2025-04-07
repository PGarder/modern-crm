const mongoose = require('mongoose');

const IntegrationSchema = new mongoose.Schema({
    system: {
        type: String,
        enum: ['adorbit', 'omeda'],
        required: true
    },
    lastSync: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'error'],
        default: 'active'
    },
    syncHistory: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            enum: ['full', 'incremental', 'error']
        },
        recordsProcessed: {
            contacts: Number,
            leads: Number,
            orders: Number
        },
        error: {
            message: String,
            details: mongoose.Schema.Types.Mixed
        }
    }],
    config: {
        apiKey: String,
        apiUrl: String,
        syncInterval: {
            type: Number,
            default: 3600 // 1 hour in seconds
        },
        lastProcessedId: String,
        mappings: {
            contacts: mongoose.Schema.Types.Mixed,
            leads: mongoose.Schema.Types.Mixed,
            orders: mongoose.Schema.Types.Mixed
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp before saving
IntegrationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Integration', IntegrationSchema); 