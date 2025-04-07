const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    },
    status: {
        type: String,
        enum: ['pipeline', 'best-case', 'commit', 'closed', 'lost'],
        default: 'pipeline'
    },
    stage: {
        type: String,
        enum: ['prospecting', 'qualification', 'needs-analysis', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
        default: 'prospecting'
    },
    source: {
        type: String,
        enum: ['website', 'referral', 'social', 'event', 'other'],
        default: 'other'
    },
    dealType: {
        type: String,
        enum: ['new', 'renewal'],
        default: 'new'
    },
    territory: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        default: 0
    },
    weightedValue: {
        type: Number,
        default: 0
    },
    probability: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    expectedCloseDate: {
        type: Date,
        required: true
    },
    lostReason: {
        type: String,
        enum: ['price', 'competition', 'no-budget', 'no-decision', 'timing', 'other'],
        default: 'other'
    },
    products: [{
        product: {
            type: String,
            required: true
        },
        channel: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: [{
        content: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    activities: [{
        type: {
            type: String,
            enum: ['call', 'email', 'meeting', 'note', 'other']
        },
        description: String,
        date: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate weighted value before saving
LeadSchema.pre('save', function(next) {
    this.weightedValue = (this.value * this.probability) / 100;
    this.updatedAt = Date.now();
    next();
});

// Static method to get KPI reports
LeadSchema.statics.getKPIReport = async function(startDate, endDate, territory = null) {
    const match = {
        createdAt: {
            $gte: startDate,
            $lte: endDate
        }
    };
    
    if (territory) {
        match.territory = territory;
    }

    return this.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalOpportunities: { $sum: 1 },
                totalPipelineValue: { $sum: '$value' },
                totalWeightedValue: { $sum: '$weightedValue' },
                newDeals: { $sum: { $cond: [{ $eq: ['$dealType', 'new'] }, 1, 0] } },
                renewalDeals: { $sum: { $cond: [{ $eq: ['$dealType', 'renewal'] }, 1, 0] } },
                wonDeals: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
                lostDeals: { $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] } }
            }
        },
        {
            $project: {
                _id: 0,
                totalOpportunities: 1,
                totalPipelineValue: 1,
                totalWeightedValue: 1,
                newDeals: 1,
                renewalDeals: 1,
                winRate: {
                    $multiply: [
                        { $divide: ['$wonDeals', { $add: ['$wonDeals', '$lostDeals'] }] },
                        100
                    ]
                }
            }
        }
    ]);
};

module.exports = mongoose.model('Lead', LeadSchema); 