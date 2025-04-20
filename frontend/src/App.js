import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Minibar from './pages/Minibar';
import Financial from './pages/Financial';
import Fiscal from './pages/Fiscal';
import Users from './pages/Users';
import TEFPayment from './pages/TEFPayment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/minibar" element={<Minibar />} />
        <Route path="/financial" element={<Financial />} />
        <Route path="/fiscal" element={<Fiscal />} />
        <Route path="/users" element={<Users />} />
        <Route path="/tef-payment" element={<TEFPayment />} />
      </Routes>
    </Router>
  );
}

export default App;
