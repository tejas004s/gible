import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`);

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
      <div className="card">
        <div className="card-header">
          <h3>Pickup Status</h3>
        </div>
        <div className="card-body">
          <p>{status || 'Waiting for status updates...'}</p>
        </div>
      </div>
    </div>
  );
}

export default PickupStatus;