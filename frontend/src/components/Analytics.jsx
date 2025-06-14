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
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';

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
        label: 'Total Quantity (kg)',
        data: analyticsData.map((item) => item.totalQuantity),
        backgroundColor: analyticsData.map((item) =>
          item.wasteType === 'organic'
            ? 'rgba(60, 137, 109, 0.8)'
            : item.wasteType === 'plastic'
            ? 'rgba(0, 123, 255, 0.8)'
            : item.wasteType === 'e-waste'
            ? 'rgba(249, 178, 51, 0.8)'
            : 'rgba(108, 117, 125, 0.8)'
        ),
        borderColor: analyticsData.map((item) =>
          item.wasteType === 'organic'
            ? 'rgba(60, 137, 109, 1)'
            : item.wasteType === 'plastic'
            ? 'rgba(0, 123, 255, 1)'
            : item.wasteType === 'e-waste'
            ? 'rgba(249, 178, 51, 1)'
            : 'rgba(108, 117, 125, 1)'
        ),
        borderWidth: 1,
        hoverBackgroundColor: analyticsData.map((item) =>
          item.wasteType === 'organic'
            ? 'rgba(60, 137, 109, 1)'
            : item.wasteType === 'plastic'
            ? 'rgba(0, 123, 255, 1)'
            : item.wasteType === 'e-waste'
            ? 'rgba(249, 178, 51, 1)'
            : 'rgba(108, 117, 125, 1)'
        ),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#333', font: { size: 14 } },
      },
      title: {
        display: true,
        text: 'Waste Collection by Type',
        color: '#333',
        font: { size: 20, weight: 'bold' },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: { color: '#333', font: { size: 12 } },
        grid: { display: false },
        title: {
          display: true,
          text: 'Waste Type',
          color: '#333',
          font: { size: 14 },
        },
      },
      y: {
        ticks: { color: '#333', font: { size: 12 } },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        title: {
          display: true,
          text: 'Total Quantity (kg)',
          color: '#333',
          font: { size: 14 },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container py-5 bg-light min-vh-100">
      <div className="card border-0 shadow-lg animate__animated animate__fadeIn">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0 d-flex align-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-bar-chart-line me-2"
              viewBox="0 0 16 16"
            >
              <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h6V2a1 1 0 0 1-1-1h2zm-1 12V3H6v11h4z"/>
            </svg>
            Waste Analytics
          </h3>
        </div>
        <div className="card-body bg-white">
          <div className="row mb-4 g-3">
            <div className="col-md-4 col-sm-12">
              <label htmlFor="startDate" className="form-label fw-semibold">
                Start Date
              </label>
              <input
                type="date"
                className="form-control"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                aria-label="Select start date"
              />
            </div>
            <div className="col-md-4 col-sm-12">
              <label htmlFor="endDate" className="form-label fw-semibold">
                End Date
              </label>
              <input
                type="date"
                className="form-control"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                aria-label="Select end date"
              />
            </div>
            <div className="col-md-4 col-sm-12 d-flex flex-column">
              <label htmlFor="userId" className="form-label fw-semibold">
                User ID
              </label>
              <input
                type="text"
                className="form-control"
                id="userId"
                name="userId"
                placeholder="Optional"
                value={filters.userId}
                onChange={handleFilterChange}
                aria-label="Enter user ID (optional)"
              />
              <button
                className="btn btn-outline-primary btn-sm mt-3 align-self-start"
                onClick={resetFilters}
                aria-label="Reset all filters"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : analyticsData.length > 0 ? (
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="alert alert-info text-center" role="alert">
              No data to display. Adjust the filters above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;