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
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userId: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      })
      .then((res) => setAnalyticsData(res.data))
      .catch((err) => {
        alert(err.response?.data?.error || 'Failed to fetch analytics');
      });
  }, [filters]);

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const chartData = {
    labels: analyticsData.map((item) => item.wasteType),
    datasets: [
      {
        label: 'Total Quantity',
        data: analyticsData.map((item) => item.totalQuantity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Waste Collection by Type' },
    },
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h3>Waste Analytics</h3>
        </div>
        <div className="card-body">
          <div className="row mb-4">
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
                value={filters.userId}
                onChange={handleFilterChange}
                placeholder="Optional"
              />
            </div>
          </div>

          {analyticsData.length > 0 ? (
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
