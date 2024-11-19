import './index.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Chat from './pages/Chat';
import StockOptions from './pages/StockOptions';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="navbar">
            <h1 className="navbar-heading">FinAdvice</h1>
            <div className="navbar-tabs">
              <Link to="/" className="navbar-tab">Chat</Link>
              <Link to="/stock-options" className="navbar-tab">Stock Options</Link>
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/stock-options" element={<StockOptions />} />
          </Routes>
        </header>
        
      </div>
    </Router>
  );
}

export default App;