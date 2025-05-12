import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaArrowRight } from 'react-icons/fa';

function ChildrenList() {
  const [children, setChildren] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setUserRole(decoded.userType); // 👈 pour savoir qui est connecté

          const res = await axios.get('http://localhost:5000/api/medical-reports/children', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setChildren(res.data);
        }
      } catch (err) {
        console.error('Error fetching children:', err);
      }
    };

    fetchChildren();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-pink-600 mb-6">
        {userRole === 'parent' ? '👶 My Children' : '👶 All Children Folders'}
      </h2>

      {children.length === 0 ? (
        <p className="text-gray-500 italic">No children found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child, index) => (
            <Link
              key={index}
              to={`/user-dashboard/children/${child.parentId}/${child.childIndex}`}
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition duration-200 border border-pink-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <FaUser className="text-pink-400 text-xl" />
                <FaArrowRight className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {child.fullName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userRole === 'healthcareprofessional' && <>Parent ID: {child.parentId}</>}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChildrenList;
