import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ProfileSection = () => {
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const profileEndpoint =
        decoded.userType === 'admin'
          ? 'http://localhost:5000/api/admin/profile'
          : 'http://localhost:5000/api/users/profile';

      axios
        .get(profileEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUserData(res.data))
        .catch((err) => {
          console.error(err);
        });
    }
  }, [token]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const decoded = jwtDecode(token);
    const profileEndpoint =
      decoded.userType === 'admin'
        ? 'http://localhost:5000/api/admin/profile'
        : 'http://localhost:5000/api/users/profile';

    await axios.put(profileEndpoint, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEditMode(false);
  };

  return (
    <div className="profile-section">
      <h2>My Profile</h2>
      {Object.keys(userData).length > 0 && (
        <div>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={userData.name || ''}
            onChange={handleChange}
            disabled={!editMode}
          />
          <br />
          <label>Email: </label>
          <input type="email" name="email" value={userData.email || ''} disabled />
          <br />
          <button onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel' : 'Edit'}
          </button>
          {editMode && <button onClick={handleSave}>Save</button>}
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
