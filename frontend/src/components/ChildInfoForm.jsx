import React, { useState } from 'react';
import axios from 'axios';

function EditChildInfoForm({ childInfo, parentId, childIndex, onUpdate }) {
  const [formData, setFormData] = useState({
    level: childInfo.level || '',
    behavior: childInfo.behavior || '',
    behaviorDescription: childInfo.behaviorDescription || '',
    childSchool: childInfo.childSchool || '',
    medications: childInfo.medications || ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `http://localhost:5000/api/medical-reports/dossier/${parentId}/${childIndex}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('✅ Successfully updated child info.');
      onUpdate();
    } catch (error) {
      console.error('Failed to update child info:', error);
      alert('❌ Failed to update child info.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-pink-50 dark:bg-gray-800 p-6 rounded-lg shadow space-y-6 mt-10">
      <h2 className="text-2xl font-bold text-pink-600 mb-6">📝 Edit Child Information</h2>


      

      {/* Level */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Level:</label>
        <input
          type="text"
          name="level"
          value={formData.level}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Behavior */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Behavior:</label>
        <input
          type="text"
          name="behavior"
          value={formData.behavior}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Behavior Description */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Behavior Description:</label>
        <textarea
          name="behaviorDescription"
          value={formData.behaviorDescription}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
        ></textarea>
      </div>

      {/* School */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300">School:</label>
        <input
          type="text"
          name="childSchool"
          value={formData.childSchool}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Medications */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Medications:</label>
        <input
          type="text"
          name="medications"
          value={formData.medications}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

export default EditChildInfoForm;
