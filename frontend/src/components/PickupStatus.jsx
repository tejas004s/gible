import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

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
    <div className="container mt-5">
      <div
        className="card shadow border-0"
        style={{ backgroundColor: '#5D7694', color: '#FDFDFD' }}
      >
        <div
          className="card-header"
          style={{ backgroundColor: '#F9B233', color: '#333' }}
        >
          <h3 className="mb-0">Pickup Status</h3>
        </div>
        <div className="card-body">
          <p className="lead">
            {status || 'Waiting for status updates...'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PickupStatus;
