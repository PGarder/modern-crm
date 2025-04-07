import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Components
import Dashboard from './components/Dashboard';
import Pipeline from './components/Pipeline';
import Reports from './components/Reports';
import Customers from './components/Customers';
import Integrations from './components/Integrations';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <div className="header-content">
                        <h1>Gardner Business Media CRM</h1>
                        <nav>
                            <ul>
                                <li><Link to="/">Dashboard</Link></li>
                                <li><Link to="/pipeline">Pipeline</Link></li>
                                <li><Link to="/reports">Reports</Link></li>
                                <li><Link to="/customers">Customers</Link></li>
                                <li><Link to="/integrations">Integrations</Link></li>
                            </ul>
                        </nav>
                    </div>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/pipeline" element={<Pipeline />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/integrations" element={<Integrations />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App; 