import React, { useState, useEffect } from 'react';

import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';

function App() {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');

  useEffect(() => {
    // Check API health
    fetch('http://localhost:3001/health')
      .then(response => response.json())
      .then(() => setApiStatus('Connected'))
      .catch(() => setApiStatus('Disconnected'));
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>🤖 AI Marketing Assistant</h1>
          <p>Comprehensive Marketing Automation Platform</p>
          <div style={{ margin: '20px 0' }}>
            <Link to="/campaigns" style={{ fontWeight: 'bold', color: '#1890ff', fontSize: 18 }}>Go to Campaign Management</Link>
          </div>
          <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h3>System Status</h3>
            <p><strong>Backend API:</strong> <span style={{ color: apiStatus === 'Connected' ? 'green' : 'red' }}>{apiStatus}</span></p>
            <p><strong>Frontend:</strong> <span style={{ color: 'green' }}>Running</span></p>
          </div>

          <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#e8f4fd', borderRadius: '8px' }}>
            <h3>🚀 Ready for Development</h3>
            <p>Your AI Marketing Assistant is now running with:</p>
            <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
              <li>✅ Node.js 18.20.8 Backend API</li>
              <li>✅ PostgreSQL Database</li>
              <li>✅ React TypeScript Frontend</li>
              <li>✅ Campaign Management System</li>
              <li>✅ Content Management</li>
              <li>✅ Analytics Tracking</li>
            </ul>
          </div>

          <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
            <h3>📋 Next Steps</h3>
            <p>1. Set up social media API integrations</p>
            <p>2. Create your first marketing campaign</p>
            <p>3. Upload content and images</p>
            <p>4. Configure WeChat Mini Program</p>
          </div>

          <div style={{ marginTop: '40px' }}>
            <a 
              href="http://localhost:3001/health" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                padding: '10px 20px', 
                textDecoration: 'none', 
                borderRadius: '5px',
                margin: '0 10px'
              }}
            >
              Test API
            </a>
            <a 
              href="http://localhost:3001/api/test" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                backgroundColor: '#28a745', 
                color: 'white', 
                padding: '10px 20px', 
                textDecoration: 'none', 
                borderRadius: '5px',
                margin: '0 10px'
              }}
            >
              API Test Endpoint
            </a>
          </div>
        </header>
        <Routes>
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaign/:id" element={<CampaignDetail />} />
          <Route path="/" element={<></>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 
 