import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import NavBar from './components/navbar';

// Pages
import Home from './pages';
import Register from './pages/register';
import Login from './pages/login';

function App() {
  return (
    <Router>
      <NavBar />
      <div className="top-space"></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router >
  );
}

export default App;
