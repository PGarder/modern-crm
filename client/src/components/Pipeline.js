import React from 'react';

const Pipeline = () => {
    // Mock data - in a real app, this would come from your API
    const opportunities = [
        {
            id: 1,
            name: 'Acme Corp - Q2 Campaign',
            value: '$150K',
            stage: 'Pipeline',
            probability: '20%',
            closeDate: '2024-06-30',
            type: 'New',
            owner: 'John Smith'
        },
        {
            id: 2,
            name: 'Tech Solutions - Renewal',
            value: '$75K',
            stage: 'Best Case',
            probability: '50%',
            closeDate: '2024-05-15',
            type: 'Renewal',
            owner: 'Sarah Johnson'
        },
        // Add more mock opportunities as needed
    ];

    return (
        <div className="pipeline">
            <h2>Sales Pipeline</h2>
            
            {/* Pipeline Filters */}
            <div className="filters">
                <select>
                    <option value="all">All Stages</option>
                    <option value="pipeline">Pipeline</option>
                    <option value="best-case">Best Case</option>
                    <option value="commit">Commit</option>
                    <option value="closed">Closed</option>
                </select>
                <select>
                    <option value="all">All Types</option>
                    <option value="new">New Business</option>
                    <option value="renewal">Renewal</option>
                </select>
                <input type="date" placeholder="Close Date Range" />
            </div>

            {/* Opportunities Table */}
            <div className="opportunities-table">
                <table>
                    <thead>
                        <tr>
                            <th>Opportunity</th>
                            <th>Value</th>
                            <th>Stage</th>
                            <th>Probability</th>
                            <th>Close Date</th>
                            <th>Type</th>
                            <th>Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {opportunities.map(opp => (
                            <tr key={opp.id}>
                                <td>{opp.name}</td>
                                <td>{opp.value}</td>
                                <td>{opp.stage}</td>
                                <td>{opp.probability}</td>
                                <td>{opp.closeDate}</td>
                                <td>{opp.type}</td>
                                <td>{opp.owner}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pipeline Summary */}
            <div className="pipeline-summary">
                <div className="summary-card">
                    <h3>Total Pipeline Value</h3>
                    <p className="value">$2.5M</p>
                    <div className="breakdown">
                        <div>
                            <span>New Business:</span>
                            <span>$1.6M (65%)</span>
                        </div>
                        <div>
                            <span>Renewals:</span>
                            <span>$900K (35%)</span>
                        </div>
                    </div>
                </div>

                <div className="summary-card">
                    <h3>Weighted Pipeline</h3>
                    <p className="value">$1.8M</p>
                    <div className="breakdown">
                        <div>
                            <span>New Business:</span>
                            <span>$1.1M (61%)</span>
                        </div>
                        <div>
                            <span>Renewals:</span>
                            <span>$700K (39%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pipeline; 