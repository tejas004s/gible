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
      await axios.post('http://localhost:5000/api/pickups', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Pickup scheduled');
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Schedule Pickup</h2>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        required
      />
      <select name="wasteType" value={formData.wasteType} onChange={handleChange}>
        <option value="recyclable">Recyclable</option>
        <option value="organic">Organic</option>
        <option value="hazardous">Hazardous</option>
        <option value="general">General</option>
      </select>
      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        min="1"
        required
      />
      <button type="submit">Schedule</button>
    </form>
  );
}

export default PickupForm;