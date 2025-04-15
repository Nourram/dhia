import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ChildFileList = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get('/api/child-files', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setFiles(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading files');
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow rounded">
      <div className="mb-6 text-right">
        <Link
          to="/user-dashboard"
          className="inline-block px-4 py-2 bg-pink-400 text-white rounded hover:bg-pink-600 transition"
        >
          ⬅ Back to Dashboard
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-6">Parent Child Files</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {files.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 italic">No files found.</p>
      ) : (
        <ul className="space-y-4">
          {files.map((file) => (
            <li key={file._id} className="p-4 border rounded dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <p><strong>👨‍👩‍👧 Parent:</strong> {file.parentId?.name || 'Unknown'} ({file.parentId?.email})</p>
              <p><strong>🧒 Child:</strong> {file.childName}</p>
              <p><strong>🕒 Last Updated:</strong> {new Date(file.lastUpdated).toLocaleDateString()}</p>
              <Link
                to={`/user-dashboard/child-file/${file.parentId._id}`}
                className="inline-block mt-3 px-4 py-2 bg-pink-500 text-white rounded shadow hover:bg-pink-600 transition"
              >
                View File
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChildFileList;