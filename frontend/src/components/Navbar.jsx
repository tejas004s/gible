import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setUser({ role: decoded.role });
        } catch (err) {
          console.error('Invalid token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    updateUser();
    window.addEventListener('storage', updateUser);
    return () => window.removeEventListener('storage', updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  const gibleLogo = "https://img.pokemondb.net/artwork/gible.jpg";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary animate__animated animate__fadeIn">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" aria-label="Gible Home">
          <img
            src={gibleLogo}
            alt="Gible Logo"
            className="navbar-logo"
          />
          <div className="d-flex flex-column">
            <span className="fw-bold text-white">Gible</span>
            <small className="text-white" style={{ fontSize: '0.75rem' }}>Garbage Disposal App</small>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/" aria-label="Go to Home">Home</Link>
            </li>
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/signup" aria-label="Go to Sign Up">Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login" aria-label="Go to Login">Log In</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link text-white" to="/pickup" aria-label="Schedule a Pickup">Schedule Pickup</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/status" aria-label="Check Status">Status</Link>
            </li>
            {user?.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/admin" aria-label="Go to Admin Dashboard">Admin Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/analytics" aria-label="Go to Analytics">Analytics</Link>
                </li>
              </>
            )}
            {user && (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm ms-2 d-flex align-items-center gap-1"
                  onClick={handleLogout}
                  aria-label="Log out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-box-arrow-right"
                    viewBox="0 0 16 16"
                  >
                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                  </svg>
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