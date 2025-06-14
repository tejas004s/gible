import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div
            className="card shadow-lg border-0"
            style={{ backgroundColor: '#5D7694', color: '#FFF' }}
          >
            <div className="card-body">
              <h1 className="display-4 fw-bold" style={{ color: '#F9B233' }}>
                Gible
              </h1>
              <h5 className="mb-4" style={{ color: '#EDEDED' }}>
                Garbage Disposal App
              </h5>
              <p className="card-text lead" style={{ color: '#F1F1F1' }}>
                Easily schedule waste pickups, track your requests, and contribute to a cleaner environment.
              </p>
              <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                <Link
                  to="/signup"
                  className="btn btn-lg"
                  style={{
                    backgroundColor: '#E94E3C',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline-light btn-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/pickup"
                  className="btn btn-lg"
                  style={{
                    backgroundColor: '#3C896D',
                    color: 'white',
                    border: 'none',
                  }}
                >
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
