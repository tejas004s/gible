import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';

const socket = io(import.meta.env.VITE_API_BASE_URL);

function PickupStatus() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    socket.on('statusUpdate', (data) => {
      setStatus(`Pickup ${data.pickupId} status: ${data.status}`);
    });
    return () => socket.off('statusUpdate');
  }, []);

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
              className="bi bi-info-circle me-2"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
            Pickup Status
          </h3>
        </div>
        <div className="card-body bg-white">
          {status ? (
            <div className="alert alert-info d-flex align-items-center gap-2" role="alert">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-bell"
                viewBox="0 0 16 16"
              >
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
              </svg>
              <span>{status}</span>
            </div>
          ) : (
            <div className="text-center text-muted">
              <p className="lead mb-0">Waiting for status updates...</p>
              <small>Stay tuned for real-time pickup status notifications.</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PickupStatus;