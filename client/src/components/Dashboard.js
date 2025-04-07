import React from 'react';

const Dashboard = () => {
    // Mock data - in a real app, this would come from your API
    const kpis = [
        { title: 'Total Pipeline Value', value: '$2.5M', change: '+12%', isPositive: true },
        { title: 'Weighted Revenue', value: '$1.8M', change: '+8%', isPositive: true },
        { title: 'Win Rate', value: '42%', change: '+5%', isPositive: true },
        { title: 'New vs Renewal Ratio', value: '65/35', change: '+3%', isPositive: true }
    ];

    const pipelineStages = [
        { name: 'Pipeline', value: '$1.2M', count: 24 },
        { name: 'Best Case', value: '$800K', count: 16 },
        { name: 'Commit', value: '$500K', count: 10 },
        { name: 'Closed', value: '$1.1M', count: 22 }
    ];

    return (
        <div className="dashboard">
            <h2>Sales Dashboard</h2>
            
            {/* KPI Grid */}
            <div className="kpi-grid">
                {kpis.map((kpi, index) => (
                    <div key={index} className="kpi-card">
                        <h3>{kpi.title}</h3>
                        <p className="kpi-value">{kpi.value}</p>
                        <p className={`kpi-change ${kpi.isPositive ? 'positive' : 'negative'}`}>
                            {kpi.change}
                        </p>
                    </div>
                ))}
            </div>

            {/* Pipeline Stages */}
            <h3>Pipeline Stages</h3>
            <div className="pipeline-stages">
                {pipelineStages.map((stage, index) => (
                    <div key={index} className="stage-card">
                        <h4>{stage.name}</h4>
                        <p className="stage-value">{stage.value}</p>
                        <p className="stage-count">{stage.count} opportunities</p>
                    </div>
                ))}
            </div>

            {/* Aging Report */}
            <div className="report-card">
                <h3>Aging Report</h3>
                <div className="aging-grid">
                    <div>
                        <h4>0-30 Days</h4>
                        <p>$450K (18)</p>
                    </div>
                    <div>
                        <h4>31-60 Days</h4>
                        <p>$320K (12)</p>
                    </div>
                    <div>
                        <h4>61-90 Days</h4>
                        <p>$280K (10)</p>
                    </div>
                    <div>
                        <h4>90+ Days</h4>
                        <p>$150K (6)</p>
                    </div>
                </div>
            </div>

            {/* Lost Business Report */}
            <div className="report-card">
                <h3>Lost Business Analysis</h3>
                <div className="lost-reasons">
                    <div>
                        <h4>Price</h4>
                        <p>35% ($420K)</p>
                    </div>
                    <div>
                        <h4>Timing</h4>
                        <p>25% ($300K)</p>
                    </div>
                    <div>
                        <h4>Competition</h4>
                        <p>20% ($240K)</p>
                    </div>
                    <div>
                        <h4>Other</h4>
                        <p>20% ($240K)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 