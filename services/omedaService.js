const axios = require('axios');

class OmedaService {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.apiUrl = config.apiUrl || 'https://api.omeda.com/v1';
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
            const response = await this.client.get('/subscribers', {
                params: {
                    updated_since: lastSync ? lastSync.toISOString() : undefined
                }
            });
            return response.data.subscribers.map(subscriber => ({
                firstName: subscriber.first_name,
                lastName: subscriber.last_name,
                email: subscriber.email,
                phone: subscriber.phone,
                company: subscriber.company,
                title: subscriber.title,
                externalId: subscriber.id,
                source: 'omeda',
                metadata: {
                    omedaId: subscriber.id,
                    lastUpdated: subscriber.updated_at,
                    subscriptionStatus: subscriber.status
                }
            }));
        } catch (error) {
            console.error('Error fetching OMEDA contacts:', error);
            throw new Error(`Failed to fetch OMEDA contacts: ${error.message}`);
        }
    }

    async fetchLeads(lastSync) {
        try {
            const response = await this.client.get('/orders', {
                params: {
                    updated_since: lastSync ? lastSync.toISOString() : undefined
                }
            });
            return response.data.orders.map(order => ({
                name: order.campaign_name,
                value: order.total_amount,
                stage: this.mapStage(order.status),
                status: this.mapStatus(order.status),
                probability: this.mapProbability(order.status),
                source: 'omeda',
                externalId: order.id,
                metadata: {
                    omedaId: order.id,
                    lastUpdated: order.updated_at,
                    originalStatus: order.status,
                    campaignId: order.campaign_id
                }
            }));
        } catch (error) {
            console.error('Error fetching OMEDA leads:', error);
            throw new Error(`Failed to fetch OMEDA leads: ${error.message}`);
        }
    }

    mapStage(omedaStatus) {
        const stageMap = {
            'pending': 'prospect',
            'processing': 'qualified',
            'approved': 'analysis',
            'in_progress': 'proposal',
            'completed': 'closed',
            'cancelled': 'lost'
        };
        return stageMap[omedaStatus] || 'prospect';
    }

    mapStatus(omedaStatus) {
        const statusMap = {
            'pending': 'active',
            'processing': 'active',
            'approved': 'active',
            'in_progress': 'active',
            'completed': 'closed',
            'cancelled': 'lost'
        };
        return statusMap[omedaStatus] || 'active';
    }

    mapProbability(status) {
        const probabilityMap = {
            'pending': 10,
            'processing': 30,
            'approved': 50,
            'in_progress': 70,
            'completed': 100,
            'cancelled': 0
        };
        return probabilityMap[status] || 0;
    }
}

module.exports = OmedaService; 