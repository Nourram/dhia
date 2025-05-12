import React from 'react';
import AdminContactList from './AdminContactList';

const AdminHome = () => {
  const [adminId, setAdminId] = React.useState(null);

  React.useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const res = await fetch('/api/admin/admin-id');
        const data = await res.json();
        setAdminId(data.adminId);
      } catch (error) {
        console.error('Failed to fetch admin ID:', error);
      }
    };
    fetchAdminId();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-pink-600 mb-4 text-center">Welcome to the Admin Dashboard</h2>
      {adminId ? <AdminContactList adminId={adminId} /> : <p>Loading admin data...</p>}
    </div>
  );
};

export default AdminHome;
