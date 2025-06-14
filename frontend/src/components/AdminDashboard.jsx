import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [pickups, setPickups] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = async () => {
      try {
        const [pickupRes, scheduleRes, driverRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/pickups`, { headers }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/schedules`, { headers }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/drivers`, { headers }),
        ]);
        setPickups(pickupRes.data);
        setSchedules(scheduleRes.data);
        setDrivers(driverRes.data);
      } catch (err) {
        alert(err.response?.data?.error || 'Something went wrong.');
        if (err.response?.status === 403) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
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
      setPickups((prev) =>
        prev.map((p) => (p._id === pickupId ? { ...p, status } : p))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status.');
    }
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

const Section = ({ title, children }) => (
  <div className="card mb-4 shadow-sm border-0" style={{ backgroundColor: '#5D7694', color: '#FDFDFD' }}>
    <div className="card-header" style={{ backgroundColor: '#F9B233', color: '#333' }}>
      <h5 className="mb-0">{title}</h5>
    </div>
    <div className="card-body">{children}</div>
  </div>
);


  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Admin Dashboard</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/analytics')}>
          📊 Analytics
        </button>
      </div>

      <Section title={`🛻 Pickups (${pickups.length})`}>
        {pickups.length ? (
          <ul className="list-group">
            {pickups.map((pickup) => (
              <li key={pickup._id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  <strong>{pickup.userId?.name || 'Unknown'}</strong> | {pickup.wasteType} |{' '}
                  {pickup.date?.slice(0, 10)} | {pickup.status}
                </span>
                <select
                  className="form-select w-auto"
                  value={pickup.status}
                  onChange={(e) => handleStatusUpdate(pickup._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No pickup records found.</p>
        )}
      </Section>

      <Section title={`🗓️ Schedules (${schedules.length})`}>
        {schedules.length ? (
          <ul className="list-group">
            {schedules.map((s) => (
              <li key={s._id} className="list-group-item">
                Pickup: {s.pickupId?.wasteType || 'N/A'} | Driver: {s.driverId?.name || 'N/A'} | Date:{' '}
                {s.date?.slice(0, 10)} | Time: {s.time}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No schedules available.</p>
        )}
      </Section>

      <Section title={`🚚 Drivers (${drivers.length})`}>
        {drivers.length ? (
          <ul className="list-group">
            {drivers.map((driver) => (
              <li key={driver._id} className="list-group-item">
                <strong>{driver.name}</strong> | Phone: {driver.phone} | Vehicle: {driver.vehicleId}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No drivers registered yet.</p>
        )}
      </Section>
    </div>
  );
}

export default AdminDashboard;
