import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';

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
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const Section = ({ title, children }) => (
    <div className="card mb-4 shadow-sm border-0 animate__animated animate__fadeIn">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0 d-flex align-items-center">
          <span>{title}</span>
        </h5>
      </div>
      <div className="card-body bg-light">{children}</div>
    </div>
  );

  return (
    <div className="container py-5 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold text-dark animate__animated animate__fadeInDown">
          Admin Dashboard
        </h2>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => navigate('/analytics')}
          aria-label="View Analytics"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-bar-chart"
            viewBox="0 0 16 16"
          >
            <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5 0h-2v7h2V7zM4 3H2v4h2V3zm5 0H7v4h2V3zm5 0h-2v4h2V3zM1 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H1zm14 1H1v12h14V2z"/>
          </svg>
          Analytics
        </button>
      </div>

      <Section title={`🛻 Pickups (${pickups.length})`}>
        {pickups.length ? (
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
        ) : (
          <p className="text-muted m-3">No pickup records found.</p>
        )}
      </Section>

      <Section title={`🗓️ Schedules (${schedules.length})`}>
        {schedules.length ? (
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle">
              <thead className="table-primary">
                <tr>
                  <th scope="col">Pickup</th>
                  <th scope="col">Driver</th>
                  <th scope="col">Date</th>
                  <th scope="col">Time</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s._id} className="animate__animated animate__fadeIn">
                    <td>{s.pickupId?.wasteType || 'N/A'}</td>
                    <td>{s.driverId?.name || 'N/A'}</td>
                    <td>{s.date?.slice(0, 10)}</td>
                    <td>{s.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted m-3">No schedules available.</p>
        )}
      </Section>

      <Section title={`🚚 Drivers (${drivers.length})`}>
        {drivers.length ? (
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle">
              <thead className="table-primary">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Vehicle</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver._id} className="animate__animated animate__fadeIn">
                    <td>{driver.name}</td>
                    <td>{driver.phone}</td>
                    <td>{driver.vehicleId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted m-3">No drivers registered yet.</p>
        )}
      </Section>
    </div>
  );
}

export default AdminDashboard;