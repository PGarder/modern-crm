import React from 'react';

const Reports = () => {
    return (
        <div className="reports">
            <h2>Analytics & Reports</h2>

            {/* KPI Trends */}
            <div className="report-section">
                <h3>KPI Trends</h3>
                <div className="trends-grid">
                    <div className="trend-card">
                        <h4>Win Rate Trend</h4>
                        <div className="trend-chart">
                            {/* Chart would go here */}
                            <p>42% Current | 37% Last Quarter</p>
                        </div>
                    </div>
                    <div className="trend-card">
                        <h4>Sales Cycle Length</h4>
                        <div className="trend-chart">
                            {/* Chart would go here */}
                            <p>45 days Current | 52 days Last Quarter</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Territory Performance */}
            <div className="report-section">
                <h3>Territory Performance</h3>
                <div className="territory-grid">
                    <div className="territory-card">
                        <h4>Northeast</h4>
                        <p>Pipeline: $750K</p>
                        <p>Win Rate: 45%</p>
                        <p>New vs Renewal: 70/30</p>
                    </div>
                    <div className="territory-card">
                        <h4>Midwest</h4>
                        <p>Pipeline: $600K</p>
                        <p>Win Rate: 38%</p>
                        <p>New vs Renewal: 60/40</p>
                    </div>
                    <div className="territory-card">
                        <h4>South</h4>
                        <p>Pipeline: $550K</p>
                        <p>Win Rate: 41%</p>
                        <p>New vs Renewal: 65/35</p>
                    </div>
                    <div className="territory-card">
                        <h4>West</h4>
                        <p>Pipeline: $600K</p>
                        <p>Win Rate: 44%</p>
                        <p>New vs Renewal: 68/32</p>
                    </div>
                </div>
            </div>

            {/* Product Performance */}
            <div className="report-section">
                <h3>Product Performance</h3>
                <div className="product-grid">
                    <div className="product-card">
                        <h4>Digital Advertising</h4>
                        <p>Revenue: $1.2M</p>
                        <p>Growth: +15%</p>
                        <p>Renewal Rate: 85%</p>
                    </div>
                    <div className="product-card">
                        <h4>Print Advertising</h4>
                        <p>Revenue: $800K</p>
                        <p>Growth: -5%</p>
                        <p>Renewal Rate: 75%</p>
                    </div>
                    <div className="product-card">
                        <h4>Events</h4>
                        <p>Revenue: $500K</p>
                        <p>Growth: +25%</p>
                        <p>Renewal Rate: 90%</p>
                    </div>
                </div>
            </div>

            {/* Customer Health Score */}
            <div className="report-section">
                <h3>Customer Health Score</h3>
                <div className="health-grid">
                    <div className="health-card">
                        <h4>Healthy (80-100)</h4>
                        <p>45 Customers</p>
                        <p>$2.1M ARR</p>
                    </div>
                    <div className="health-card">
                        <h4>Moderate (50-79)</h4>
                        <p>30 Customers</p>
                        <p>$1.2M ARR</p>
                    </div>
                    <div className="health-card">
                        <h4>At Risk (0-49)</h4>
                        <p>15 Customers</p>
                        <p>$600K ARR</p>
                    </div>
                </div>
            </div>

            {/* Sales Team Performance */}
            <div className="report-section">
                <h3>Sales Team Performance</h3>
                <table className="team-performance">
                    <thead>
                        <tr>
                            <th>Sales Rep</th>
                            <th>Quota</th>
                            <th>Attainment</th>
                            <th>Win Rate</th>
                            <th>Avg. Deal Size</th>
                            <th>Sales Cycle</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>John Smith</td>
                            <td>$1.5M</td>
                            <td>85%</td>
                            <td>45%</td>
                            <td>$75K</td>
                            <td>42 days</td>
                        </tr>
                        <tr>
                            <td>Sarah Johnson</td>
                            <td>$1.2M</td>
                            <td>92%</td>
                            <td>48%</td>
                            <td>$65K</td>
                            <td>38 days</td>
                        </tr>
                        {/* Add more team members as needed */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reports; 