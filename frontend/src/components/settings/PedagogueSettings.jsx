import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PedagogueSettings = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    country: '',
    phoneNumber: '',
    experience: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData({
          name: res.data.nom || '',
          email: res.data.email || '',
          address: res.data.adresse || '',
          country: res.data.pays || '',
          phoneNumber: res.data.numeroTel || '',
          experience: res.data.experience || '',
        });
      } catch (err) {
        setError('Failed to load user information.');
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.put('http://localhost:5000/api/users/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError('Update failed.');
      setSuccess('');
    }
  };

  return (
    <div className="pedagogue-settings-container">
      <h2>Pedagogue Profile Settings</h2>
      {success && <p className="success-msg">{success}</p>}
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="settings-form">
        <label>Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>

        <label>Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>

        <label>Address:
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </label>

        <label>Country:
          <input type="text" name="country" value={formData.country} onChange={handleChange} />
        </label>

        <label>Phone Number:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </label>

        <label>Years of Experience:
          <input type="number" name="experience" value={formData.experience} onChange={handleChange} />
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default PedagogueSettings;
