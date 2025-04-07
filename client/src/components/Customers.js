import React from 'react';
import './Customers.css';

const Customers = () => {
    // Mock data - in a real app, this would come from your API
    const customers = [
        {
            id: 1,
            name: 'Acme Corporation',
            industry: 'Manufacturing',
            status: 'Active',
            healthScore: 85,
            lastContact: '2024-03-15',
            revenue: '$250K',
            products: ['Digital Advertising', 'Events'],
            territory: 'Northeast'
        },
        {
            id: 2,
            name: 'Tech Solutions Inc',
            industry: 'Technology',
            status: 'At Risk',
            healthScore: 45,
            lastContact: '2024-02-28',
            revenue: '$180K',
            products: ['Print Advertising'],
            territory: 'West'
        },
        // Add more mock customers as needed
    ];

    return (
        <div className="customers">
            <h2>Customer Management</h2>

            {/* Customer Filters */}
            <div className="filters">
                <input type="text" placeholder="Search Customers..." />
                <select>
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="at-risk">At Risk</option>
                    <option value="inactive">Inactive</option>
                </select>
                <select>
                    <option value="all">All Territories</option>
                    <option value="northeast">Northeast</option>
                    <option value="midwest">Midwest</option>
                    <option value="south">South</option>
                    <option value="west">West</option>
                </select>
            </div>

            {/* Customers List */}
            <div className="customers-grid">
                {customers.map(customer => (
                    <div key={customer.id} className="customer-card">
                        <div className="customer-header">
                            <h3>{customer.name}</h3>
                            <span className={`status-badge ${customer.status.toLowerCase()}`}>
                                {customer.status}
                            </span>
                        </div>
                        <div className="customer-details">
                            <p><strong>Industry:</strong> {customer.industry}</p>
                            <p><strong>Health Score:</strong> {customer.healthScore}</p>
                            <p><strong>Last Contact:</strong> {customer.lastContact}</p>
                            <p><strong>Annual Revenue:</strong> {customer.revenue}</p>
                            <p><strong>Territory:</strong> {customer.territory}</p>
                        </div>
                        <div className="customer-products">
                            <strong>Products:</strong>
                            <ul>
                                {customer.products.map((product, index) => (
                                    <li key={index}>{product}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="customer-actions">
                            <button>View Details</button>
                            <button>Log Activity</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Customer Health Overview */}
            <div className="health-overview">
                <h3>Customer Health Overview</h3>
                <div className="health-metrics">
                    <div className="metric-card">
                        <h4>Active Customers</h4>
                        <p className="value">85</p>
                        <p className="change positive">+5% from last quarter</p>
                    </div>
                    <div className="metric-card">
                        <h4>At Risk Customers</h4>
                        <p className="value">15</p>
                        <p className="change negative">+3% from last quarter</p>
                    </div>
                    <div className="metric-card">
                        <h4>Average Health Score</h4>
                        <p className="value">72</p>
                        <p className="change positive">+2 points from last quarter</p>
                    </div>
                </div>
            </div>

            {/* Customer Activity Timeline */}
            <div className="activity-timeline">
                <h3>Recent Customer Activities</h3>
                <div className="timeline">
                    <div className="timeline-item">
                        <div className="timeline-date">2024-03-15</div>
                        <div className="timeline-content">
                            <h4>Acme Corporation</h4>
                            <p>Quarterly business review completed</p>
                            <span className="activity-type">Meeting</span>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-date">2024-03-10</div>
                        <div className="timeline-content">
                            <h4>Tech Solutions Inc</h4>
                            <p>Renewal discussion - contract expiring in 30 days</p>
                            <span className="activity-type">Call</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Customers; 