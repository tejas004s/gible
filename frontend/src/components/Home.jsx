import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">Welcome to Garbage Disposal App</h1>
              <p className="card-text lead">
                Easily schedule waste pickups, track your requests, and contribute to a cleaner environment.
              </p>
              <div className="d-flex justify-content-center gap-3 mt-4">
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-outline-primary btn-lg">
                  Log In
                </Link>
                <Link to="/pickup" className="btn btn-success btn-lg">
                  Schedule Pickup
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;