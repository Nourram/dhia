// frontend/src/components/AdminProfile.js
import { useState, useEffect } from 'react';

function AdminProfile() {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const response = await fetch('/api/admin/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Pass the token for authentication
                    }
                });
                if (!response.ok) {
                    throw new Error('Profile not found');
                }
                const data = await response.json();
                setAdmin(data);  // Save the admin data to state
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminProfile();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Admin Profile</h1>
            <p>Name: {admin.name}</p>
            <p>Email: {admin.email}</p>
            {/* You can display more profile information here */}
        </div>
    );
}

export default AdminProfile;
