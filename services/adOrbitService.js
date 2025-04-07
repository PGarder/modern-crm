const axios = require('axios');

class AdOrbitService {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.apiUrl = config.apiUrl || 'https://api.adorbit.com/v1';
        this.client = axios.create({
            baseURL: this.apiUrl,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async fetchContacts(lastSync) {
        try {
            const response = await this.client.get('/contacts', {
                params: {
                    updated_since: lastSync ? lastSync.toISOString() : undefined
                }
            });
            return response.data.contacts.map(contact => ({
                firstName: contact.first_name,
                lastName: contact.last_name,
                email: contact.email,
                phone: contact.phone,
                company: contact.company,
                title: contact.title,
                externalId: contact.id,
                source: 'adorbit',
                metadata: {
                    adOrbitId: contact.id,
                    lastUpdated: contact.updated_at
                }
            }));
        } catch (error) {
            console.error('Error fetching Ad Orbit contacts:', error);
            throw new Error(`Failed to fetch Ad Orbit contacts: ${error.message}`);
        }
    }

    async fetchLeads(lastSync) {
        try {
            const response = await this.client.get('/opportunities', {
                params: {
                    updated_since: lastSync ? lastSync.toISOString() : undefined
                }
            });
            return response.data.opportunities.map(lead => ({
                name: lead.name,
                value: lead.amount,
                stage: this.mapStage(lead.stage),
                status: this.mapStatus(lead.status),
                probability: this.mapProbability(lead.stage),
                source: 'adorbit',
                externalId: lead.id,
                metadata: {
                    adOrbitId: lead.id,
                    lastUpdated: lead.updated_at,
                    originalStage: lead.stage
                }
            }));
        } catch (error) {
            console.error('Error fetching Ad Orbit leads:', error);
            throw new Error(`Failed to fetch Ad Orbit leads: ${error.message}`);
        }
    }

    mapStage(adorbitStage) {
        const stageMap = {
            'prospecting': 'prospect',
            'qualification': 'qualified',
            'needs_analysis': 'analysis',
            'value_proposition': 'proposal',
            'id_decision_makers': 'negotiation',
            'perception_analysis': 'negotiation',
            'proposal_price_quote': 'proposal',
            'negotiation_review': 'negotiation',
            'closed_won': 'closed',
            'closed_lost': 'lost'
        };
        return stageMap[adorbitStage] || 'prospect';
    }

    mapStatus(adorbitStatus) {
        const statusMap = {
            'open': 'active',
            'won': 'closed',
            'lost': 'lost'
        };
        return statusMap[adorbitStatus] || 'active';
    }

    mapProbability(stage) {
        const probabilityMap = {
            'prospecting': 10,
            'qualification': 20,
            'needs_analysis': 30,
            'value_proposition': 40,
            'id_decision_makers': 50,
            'perception_analysis': 60,
            'proposal_price_quote': 70,
            'negotiation_review': 80,
            'closed_won': 100,
            'closed_lost': 0
        };
        return probabilityMap[stage] || 0;
    }
}

module.exports = AdOrbitService; 