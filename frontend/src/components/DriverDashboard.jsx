import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';

function DriverDashboard() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    const socket = io(`${import.meta.env.VITE_API_BASE_URL}`, { 
      extraHeaders: { Authorization: `Bearer ${token}` },
      path: '/socket.io' // Adjust if your Socket.io path differs
    });

    // Fetch schedules to get driver-specific pickups
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/schedules`, { headers })
      .then((scheduleRes) => {
        const driverSchedules = scheduleRes.data.filter((s) => {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return s.driverId === payload._id; // Match driverId with logged-in user's _id
        });
        const pickupIds = driverSchedules.map((s) => s.pickupId);

        return axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/pickups`, { headers });
      })
      .then((pickupRes) => {
        const driverPickups = pickupRes.data.filter((p) => pickupIds.includes(p._id));
        setPickups(driverPickups);
      })
      .catch((err) => {
        alert(err.response?.data?.error || 'Failed to fetch pickups');
        if (err.response?.status === 403) navigate('/login');
      })
      .finally(() => setLoading(false));

    // Socket.io for real-time updates
    socket.on('statusUpdate', (updatedPickup) => {
      setPickups((prev) =>
        prev.map((p) => (p._id === updatedPickup._id ? updatedPickup : p))
      );
    });

    // Cleanup socket on unmount
    return () => socket.disconnect();
  }, [navigate]);

  const handleStatusUpdate = async (pickupId, status) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/pickups/${pickupId}/status`,
        { status },
        { headers }
      );
      // Status update is handled by Socket.io event from the backend
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 bg-light min-vh-100">
      <h2 className="fw-bold text-dark mb-4 animate__animated animate__fadeInDown">
        Driver Dashboard
      </h2>
      <div className="card shadow-sm border-0 animate__animated animate__fadeIn">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Assigned Pickups</h5>
        </div>
        <div className="card-body bg-light">
          {pickups.length === 0 ? (
            <p className="text-muted m-3">No pickups assigned.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle">
                <thead className="table-primary">
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Waste Type</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pickups.map((pickup) => (
                    <tr key={pickup._id} className="animate__animated animate__fadeIn">
                      <td>{pickup.userId?.name || 'Unknown'}</td>
                      <td>{pickup.wasteType}</td>
                      <td>{pickup.date?.slice(0, 10)}</td>
                      <td>
                        <span
                          className={`badge ${
                            pickup.status === 'completed'
                              ? 'bg-success'
                              : pickup.status === 'pending'
                              ? 'bg-warning'
                              : pickup.status === 'scheduled'
                              ? 'bg-info'
                              : 'bg-danger'
                          }`}
                        >
                          {pickup.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={pickup.status}
                          onChange={(e) => handleStatusUpdate(pickup._id, e.target.value)}
                          aria-label={`Update status for pickup ${pickup._id}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;