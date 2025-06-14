import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userId: '',
  });

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      })
      .then((res) => setAnalyticsData(res.data))
      .catch((err) => alert(err.response?.data?.error || 'Failed to fetch analytics'))
      .finally(() => setLoading(false));
  }, [filters]);

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const resetFilters = () => {
    setFilters({ startDate: '', endDate: '', userId: '' });
  };

  const chartData = {
    labels: analyticsData.map((item) => item.wasteType),
    datasets: [
      {
        label: 'Total Quantity',
        data: analyticsData.map((item) => item.totalQuantity),
        backgroundColor: analyticsData.map((item) =>
          item.wasteType === 'organic'
            ? '#3C896D' // green
            : item.wasteType === 'plastic'
            ? '#007bff' // blue
            : item.wasteType === 'e-waste'
            ? '#F9B233' // yellow
            : '#6c757d'
        ),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#EEE' } },
      title: {
        display: true,
        text: 'Waste Collection by Type',
        color: '#FFF',
        font: { size: 18 },
      },
    },
    scales: {
      x: { ticks: { color: '#EEE' }, grid: { color: '#4A5D72' } },
      y: { ticks: { color: '#EEE' }, grid: { color: '#4A5D72' } },
    },
  };

  return (
    <div className="container mt-5">
      <div className="card border-0 shadow-lg" style={{ backgroundColor: '#5D7694', color: '#FDFDFD' }}>
        <div className="card-header" style={{ backgroundColor: '#F9B233', color: '#333' }}>
          <h3 className="mb-0">Waste Analytics</h3>
        </div>
        <div className="card-body">
          <div className="row mb-4 text-dark">
            <div className="col-md-4">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="userId" className="form-label">User ID</label>
              <input
                type="text"
                className="form-control"
                id="userId"
                name="userId"
                placeholder="Optional"
                value={filters.userId}
                onChange={handleFilterChange}
              />
              <button className="btn btn-outline-light btn-sm mt-2" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status" />
            </div>
          ) : analyticsData.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <p className="text-muted">No data to display. Adjust the filters above.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
