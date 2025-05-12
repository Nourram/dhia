import React, { useState } from 'react';

const MediaUploadForm = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setError(null);

    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (onUpload) {
        onUpload(selectedFile);
      }
      alert('File uploaded successfully!');
      setSelectedFile(null);
    } catch (err) {
      setError('Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Upload Media</h2>
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
        accept="image/*,video/*,audio/*"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        type="submit"
        disabled={uploading}
        className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};

export default MediaUploadForm;
