import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [pickups, setPickups] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:5000/api/pickups', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPickups(res.data))
      .catch((err) => {
        alert(err.response.data.error);
        if (err.response.status === 403) navigate('/login');
      });

    axios
      .get('http://localhost:5000/api/schedules', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSchedules(res.data))
      .catch((err) => alert(err.response.data.error));

    axios
      .get('http://localhost:5000/api/drivers', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDrivers(res.data))
      .catch((err) => alert(err.response.data.error));
  }, [navigate]);

  const handleStatusUpdate = async (pickupId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/pickups/${pickupId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPickups(
        pickups.map((p) =>
          p._id === pickupId ? { ...p, status } : p
        )
      );
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <div className="card mb-4">
        <div className="card-header">
          <h3>Pickups</h3>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {pickups.map((pickup) => (
              <li key={pickup._id} className="list-group-item">
                User: {pickup.userId?.name || 'Unknown'} | Date: {pickup.date.slice(0, 10)} | 
                Waste Type: {pickup.wasteType} | Status: {pickup.status}
                <select
                  className="form-select d-inline-block ms-2"
                  style={{ width: 'auto' }}
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
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-header">
          <h3>Schedules</h3>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {schedules.map((schedule) => (
              <li key={schedule._id} className="list-group-item">
                Pickup: {schedule.pickupId?.wasteType} | Driver: {schedule.driverId?.name} | 
                Date: {schedule.date.slice(0, 10)} | Time: {schedule.time}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-header">
          <h3>Drivers</h3>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {drivers.map((driver) => (
              <li key={driver._id} className="list-group-item">
                Name: {driver.name} | Phone: {driver.phone} | Vehicle: {driver.vehicleId}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button className="btn btn-primary" onClick={() => navigate('/analytics')}>
        View Analytics
      </button>
    </div>
  );
}

export default AdminDashboard;