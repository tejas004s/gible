import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token to get user role (simplified, assumes token payload has role)
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser({ role: decoded.role });
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Garbage Disposal</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Log In</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/pickup">Schedule Pickup</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/status">Status</Link>
            </li>
            {user && user.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/analytics">Analytics</Link>
                </li>
              </>
            )}
            {user && (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>
                  Log Out
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;