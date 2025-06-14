import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#5D7694' }}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img
            src={gibleLogo}
            alt="Gible Logo"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              backgroundColor: '#F9B233',
              padding: '2px'
            }}
          />
          <span className="fw-bold text-light">Garbage Disposal</span>
        </Link>
        <button
          className="navbar-toggler text-light"
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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/">Home</Link>
            </li>
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/signup">Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/login">Log In</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link text-light" to="/pickup">Schedule Pickup</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/status">Status</Link>
            </li>
            {user?.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/admin">Admin Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/analytics">Analytics</Link>
                </li>
              </>
            )}
            {user && (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm ms-3 mt-1"
                  onClick={handleLogout}
                >
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
