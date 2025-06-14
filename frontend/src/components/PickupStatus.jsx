import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function PickupStatus() {
  const [status, setStatus] = React.useState('');

  useEffect(() => {
    socket.on('statusUpdate', (data) => {
      setStatus(`Pickup ${data.pickupId} status: ${data.status}`);
    });
    return () => socket.off('statusUpdate');
  }, []);

  return <div>{status || 'Waiting for status updates...'}</div>;
}

export default PickupStatus;