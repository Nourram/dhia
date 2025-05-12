import React, { useState } from 'react';

const EditChildInfoForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    medicalConditions: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Child information updated successfully!');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Edit Child Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-gray-700 dark:text-gray-300">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label htmlFor="medicalConditions" className="block text-gray-700 dark:text-gray-300">Medical Conditions</label>
          <textarea
            id="medicalConditions"
            name="medicalConditions"
            value={formData.medicalConditions}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
            rows="4"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditChildInfoForm;
