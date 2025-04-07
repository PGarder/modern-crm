const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

// @route   GET api/reports/kpi
// @desc    Get KPI report
// @access  Private
router.get('/kpi', auth, async (req, res) => {
    try {
        const { startDate, endDate, territory } = req.query;
        const kpiReport = await Lead.getKPIReport(
            new Date(startDate || new Date().setDate(1)), // First day of current month if not specified
            new Date(endDate || Date.now()),
            territory
        );
        res.json(kpiReport[0] || {});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/aging
// @desc    Get aging report
// @access  Private
router.get('/aging', auth, async (req, res) => {
    try {
        const agingReport = await Lead.aggregate([
            {
                $match: {
                    status: { $nin: ['closed', 'lost'] }
                }
            },
            {
                $project: {
                    value: 1,
                    weightedValue: 1,
                    ageInDays: {
                        $divide: [
                            { $subtract: [new Date(), '$createdAt'] },
                            1000 * 60 * 60 * 24
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $lte: ['$ageInDays', 30] }, then: '0-30 days' },
                                { case: { $lte: ['$ageInDays', 60] }, then: '31-60 days' },
                                { case: { $lte: ['$ageInDays', 90] }, then: '61-90 days' }
                            ],
                            default: '90+ days'
                        }
                    },
                    count: { $sum: 1 },
                    totalValue: { $sum: '$value' },
                    weightedValue: { $sum: '$weightedValue' }
                }
            }
        ]);
        res.json(agingReport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/funnel
// @desc    Get sales funnel breakdown
// @access  Private
router.get('/funnel', auth, async (req, res) => {
    try {
        const funnelReport = await Lead.aggregate([
            {
                $group: {
                    _id: '$stage',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$value' },
                    weightedValue: { $sum: '$weightedValue' }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
        res.json(funnelReport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/lost-reasons
// @desc    Get lost reasons breakdown
// @access  Private
router.get('/lost-reasons', auth, async (req, res) => {
    try {
        const lostReport = await Lead.aggregate([
            {
                $match: {
                    status: 'lost'
                }
            },
            {
                $group: {
                    _id: '$lostReason',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$value' }
                }
            }
        ]);
        res.json(lostReport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/revenue-retention
// @desc    Get net revenue retention by territory and customer
// @access  Private
router.get('/revenue-retention', auth, async (req, res) => {
    try {
        const { territory } = req.query;
        const retentionReport = await Lead.aggregate([
            {
                $match: {
                    status: 'closed',
                    ...(territory && { territory })
                }
            },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'contact',
                    foreignField: '_id',
                    as: 'contactInfo'
                }
            },
            {
                $unwind: '$contactInfo'
            },
            {
                $group: {
                    _id: {
                        territory: '$territory',
                        customer: '$contactInfo.company',
                        dealType: '$dealType'
                    },
                    revenue: { $sum: '$value' }
                }
            },
            {
                $group: {
                    _id: {
                        territory: '$_id.territory',
                        customer: '$_id.customer'
                    },
                    newRevenue: {
                        $sum: {
                            $cond: [
                                { $eq: ['$_id.dealType', 'new'] },
                                '$revenue',
                                0
                            ]
                        }
                    },
                    renewalRevenue: {
                        $sum: {
                            $cond: [
                                { $eq: ['$_id.dealType', 'renewal'] },
                                '$revenue',
                                0
                            ]
                        }
                    }
                }
            }
        ]);
        res.json(retentionReport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/customer-scoring
// @desc    Get customer scoring report
// @access  Private
router.get('/customer-scoring', auth, async (req, res) => {
    try {
        const { territory } = req.query;
        const scoringReport = await Contact.getScoringReport(territory);
        res.json(scoringReport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/stalled-orders
// @desc    Get stalled orders analysis
// @access  Private
router.get('/stalled-orders', auth, async (req, res) => {
    try {
        const { territory } = req.query;
        const stalledReport = await Lead.aggregate([
            {
                $match: {
                    status: { $in: ['pipeline', 'best-case'] },
                    probability: { $gte: 90 },
                    ...(territory && { territory })
                }
            },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'contact',
                    foreignField: '_id',
                    as: 'contactInfo'
                }
            },
            {
                $unwind: '$contactInfo'
            },
            {
                $group: {
                    _id: {
                        territory: '$territory',
                        category: '$contactInfo.category'
                    },
                    count: { $sum: 1 },
                    totalValue: { $sum: '$value' },
                    averageAge: {
                        $avg: {
                            $divide: [
                                { $subtract: [new Date(), '$createdAt'] },
                                1000 * 60 * 60 * 24
                            ]
                        }
                    }
                }
            },
            {
                $sort: {
                    '_id.territory': 1,
                    '_id.category': 1
                }
            }
        ]);
        res.json(stalledReport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/retention
// @desc    Get customer retention analysis
// @access  Private
router.get('/retention', auth, async (req, res) => {
    try {
        const { territory } = req.query;
        const retentionReport = await Contact.aggregate([
            {
                $match: {
                    status: { $in: ['customer', 'inactive'] },
                    ...(territory && { territory })
                }
            },
            {
                $lookup: {
                    from: 'leads',
                    localField: '_id',
                    foreignField: 'contact',
                    as: 'deals'
                }
            },
            {
                $project: {
                    _id: 1,
                    company: 1,
                    status: 1,
                    lastPurchaseDate: 1,
                    totalRevenue: 1,
                    dealCount: { $size: '$deals' },
                    daysSinceLastPurchase: {
                        $divide: [
                            { $subtract: [new Date(), '$lastPurchaseDate'] },
                            1000 * 60 * 60 * 24
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    averageRevenue: { $avg: '$totalRevenue' },
                    averageDaysSincePurchase: { $avg: '$daysSinceLastPurchase' }
                }
            }
        ]);
        res.json(retentionReport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/sales-cycle
// @desc    Get sales cycle analysis
// @access  Private
router.get('/sales-cycle', auth, async (req, res) => {
    try {
        const { territory } = req.query;
        const cycleReport = await Lead.aggregate([
            {
                $match: {
                    status: 'closed',
                    ...(territory && { territory })
                }
            },
            {
                $project: {
                    cycleLength: {
                        $divide: [
                            { $subtract: ['$updatedAt', '$createdAt'] },
                            1000 * 60 * 60 * 24
                        ]
                    },
                    value: 1,
                    dealType: 1
                }
            },
            {
                $group: {
                    _id: '$dealType',
                    averageCycleLength: { $avg: '$cycleLength' },
                    medianCycleLength: {
                        $median: {
                            input: '$cycleLength',
                            method: 'approximate'
                        }
                    },
                    totalValue: { $sum: '$value' }
                }
            }
        ]);
        res.json(cycleReport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 