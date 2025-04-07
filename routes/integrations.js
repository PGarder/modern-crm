const express = require('express');
const router = express.Router();
const Integration = require('../models/Integration');
const Contact = require('../models/Contact');
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');
const AdOrbitService = require('../services/adOrbitService');
const OmedaService = require('../services/omedaService');

// @route   GET api/integrations
// @desc    Get all integrations
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const integrations = await Integration.find();
        res.json(integrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/integrations
// @desc    Create or update integration
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { system, config } = req.body;
        
        let integration = await Integration.findOne({ system });
        
        if (integration) {
            // Update existing integration
            integration.config = { ...integration.config, ...config };
            await integration.save();
        } else {
            // Create new integration
            integration = new Integration({
                system,
                config
            });
            await integration.save();
        }
        
        res.json(integration);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/integrations/:system/sync
// @desc    Trigger manual sync for a system
// @access  Private
router.post('/:system/sync', auth, async (req, res) => {
    try {
        const { system } = req.params;
        const integration = await Integration.findOne({ system });
        
        if (!integration) {
            return res.status(404).json({ msg: 'Integration not found' });
        }
        
        // Start sync process
        const syncResult = await syncSystem(integration);
        
        // Update integration status and history
        integration.lastSync = new Date();
        integration.status = syncResult.error ? 'error' : 'active';
        integration.syncHistory.unshift({
            type: syncResult.type,
            recordsProcessed: syncResult.recordsProcessed,
            error: syncResult.error
        });
        await integration.save();
        
        res.json(syncResult);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/integrations/:system/status
// @desc    Get sync status for a system
// @access  Private
router.get('/:system/status', auth, async (req, res) => {
    try {
        const { system } = req.params;
        const integration = await Integration.findOne({ system });
        
        if (!integration) {
            return res.status(404).json({ msg: 'Integration not found' });
        }
        
        res.json({
            status: integration.status,
            lastSync: integration.lastSync,
            nextSync: new Date(integration.lastSync.getTime() + integration.config.syncInterval * 1000),
            recentHistory: integration.syncHistory.slice(0, 5)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Helper function to sync data with external system
async function syncSystem(integration) {
    try {
        const { system, config, lastSync } = integration;
        let recordsProcessed = { contacts: 0, leads: 0, orders: 0 };
        
        if (system === 'adorbit') {
            const adOrbitService = new AdOrbitService(config);
            const contacts = await adOrbitService.fetchContacts(lastSync);
            const leads = await adOrbitService.fetchLeads(lastSync);
            
            // Process contacts
            for (const contact of contacts) {
                await Contact.findOneAndUpdate(
                    { email: contact.email },
                    contact,
                    { upsert: true, new: true }
                );
                recordsProcessed.contacts++;
            }
            
            // Process leads
            for (const lead of leads) {
                await Lead.findOneAndUpdate(
                    { externalId: lead.externalId },
                    lead,
                    { upsert: true, new: true }
                );
                recordsProcessed.leads++;
            }
        } else if (system === 'omeda') {
            const omedaService = new OmedaService(config);
            const contacts = await omedaService.fetchContacts(lastSync);
            const leads = await omedaService.fetchLeads(lastSync);
            
            // Process contacts
            for (const contact of contacts) {
                await Contact.findOneAndUpdate(
                    { email: contact.email },
                    contact,
                    { upsert: true, new: true }
                );
                recordsProcessed.contacts++;
            }
            
            // Process leads
            for (const lead of leads) {
                await Lead.findOneAndUpdate(
                    { externalId: lead.externalId },
                    lead,
                    { upsert: true, new: true }
                );
                recordsProcessed.leads++;
            }
        }
        
        return {
            type: 'incremental',
            recordsProcessed,
            error: null
        };
    } catch (err) {
        return {
            type: 'error',
            recordsProcessed: { contacts: 0, leads: 0, orders: 0 },
            error: {
                message: err.message,
                details: err.stack
            }
        };
    }
}

// Placeholder for integration routes
router.get('/', (req, res) => {
    res.json({ message: 'Integration routes will be implemented here' });
});

module.exports = router; 