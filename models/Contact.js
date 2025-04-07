const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    company: {
        type: String
    },
    position: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'lead', 'customer', 'stalled'],
        default: 'active'
    },
    source: {
        type: String,
        enum: ['website', 'referral', 'social', 'event', 'exhibitor', 'other'],
        default: 'other'
    },
    score: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    scoreFactors: {
        engagement: {
            type: Number,
            default: 0
        },
        revenue: {
            type: Number,
            default: 0
        },
        activity: {
            type: Number,
            default: 0
        },
        potential: {
            type: Number,
            default: 0
        }
    },
    category: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        default: 'D'
    },
    lastPurchaseDate: {
        type: Date
    },
    totalRevenue: {
        type: Number,
        default: 0
    },
    averageOrderValue: {
        type: Number,
        default: 0
    },
    purchaseFrequency: {
        type: Number,
        default: 0
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    territory: {
        type: String,
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
    tags: [String],
    lastContacted: {
        type: Date
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

// Calculate score before saving
ContactSchema.pre('save', function(next) {
    // Calculate engagement score (0-25)
    const engagementScore = Math.min(25, this.scoreFactors.engagement);
    
    // Calculate revenue score (0-25)
    const revenueScore = Math.min(25, this.scoreFactors.revenue);
    
    // Calculate activity score (0-25)
    const activityScore = Math.min(25, this.scoreFactors.activity);
    
    // Calculate potential score (0-25)
    const potentialScore = Math.min(25, this.scoreFactors.potential);
    
    // Total score
    this.score = engagementScore + revenueScore + activityScore + potentialScore;
    
    // Update category based on score
    if (this.score >= 75) this.category = 'A';
    else if (this.score >= 50) this.category = 'B';
    else if (this.score >= 25) this.category = 'C';
    else this.category = 'D';
    
    this.updatedAt = Date.now();
    next();
});

// Static method to get customer scoring report
ContactSchema.statics.getScoringReport = async function(territory = null) {
    const match = territory ? { territory } : {};
    
    return this.aggregate([
        { $match: match },
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
                averageScore: { $avg: '$score' },
                totalRevenue: { $sum: '$totalRevenue' },
                averageOrderValue: { $avg: '$averageOrderValue' }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);
};

module.exports = mongoose.model('Contact', ContactSchema); 