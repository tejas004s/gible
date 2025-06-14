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
    axios
      .get('http://localhost:5000/api/analytics', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      })
      .then((res) => setAnalyticsData(res.data))
      .catch((err) => alert(err.response.data.error));
  }, [filters]);

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const chartData = {
    labels: analyticsData.map((item) => item.wasteType),
    datasets: [
      {
        label: 'Total Quantity',
        data: analyticsData.map((item) => item.totalQuantity),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div>
      <h2>Waste Analytics</h2>
      <div>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="userId"
          value={filters.userId}
          onChange={handleFilterChange}
          placeholder="User ID (optional)"
        />
      </div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: { legend: { position: 'top' }, title: { display: true, text: 'Waste by Type' } },
        }}
      />
    </div>
  );
}

export default Analytics;