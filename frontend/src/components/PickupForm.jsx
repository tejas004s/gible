import React, { useState } from 'react';
import axios from 'axios';

function PickupForm() {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    wasteType: 'recyclable',
    quantity: 1,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/pickups`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Pickup scheduled');
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Schedule Pickup</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="time" className="form-label">Time</label>
                  <input
                    type="time"
                    className="form-control"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="wasteType" className="form-label">Waste Type</label>
                  <select
                    className="form-select"
                    id="wasteType"
                    name="wasteType"
                    value={formData.wasteType}
                    onChange={handleChange}
                  >
                    <option value="recyclable">Recyclable</option>
                    <option value="organic">Organic</option>
                    <option value="hazardous">Hazardous</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="quantity" className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Schedule</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PickupForm;