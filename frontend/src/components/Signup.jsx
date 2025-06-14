import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'resident', // Default role
    address: '',
    phone: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, formData);
      localStorage.setItem('token', res.data.token);
      alert('Signup successful');
      window.dispatchEvent(new Event('storage'));
      navigate('/pickup'); // Redirect based on role could be improved (see UI/UX suggestions)
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="container py-5 bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg border-0 animate__animated animate__fadeIn" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-header bg-primary text-white text-center">
          <h3 className="mb-0 d-flex align-items-center justify-content-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-person-plus me-2"
              viewBox="0 0 16 16"
            >
              <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
              <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
            </svg>
            Sign Up
          </h3>
        </div>
        <div className="card-body bg-white">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold text-dark">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
                aria-label="Enter your full name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold text-dark">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                aria-label="Enter your email address"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold text-dark">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                aria-label="Enter your password"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label fw-semibold text-dark">
                Role
              </label>
              <select
                className="form-select"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                aria-label="Select your role"
              >
                <option value="resident">Resident</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label fw-semibold text-dark">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                required
                aria-label="Enter your address"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="form-label fw-semibold text-dark">
                Phone
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone (optional)"
                aria-label="Enter your phone number (optional)"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
              aria-label="Submit signup form"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-person-check"
                viewBox="0 0 16 16"
              >
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z"/>
              </svg>
              Sign Up
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-muted mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-semibold">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;