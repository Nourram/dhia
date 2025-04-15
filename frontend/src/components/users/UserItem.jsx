import React, { useState } from 'react';
import axios from 'axios';

const UserItem = ({ user, onUpdateUser, onDeleteUser }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Activate/Deactivate user
  const handleActivateDeactivate = () => {
    const updatedUser = { ...user, isActive: !user.isActive };
    setIsUpdating(true); // Set loading state

    axios.put(`/api/users/${user._id}`, updatedUser)
      .then(response => {
        alert(`User ${updatedUser.isActive ? 'activated' : 'deactivated'}`);
        onUpdateUser(updatedUser); // Update parent component with the new user status
      })
      .catch(error => {
        console.error("Error updating status", error);
        alert('Error updating the user status');
      })
      .finally(() => setIsUpdating(false)); // Reset loading state
  };

  // Delete user
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setIsUpdating(true); // Set loading state

      axios.delete(`/api/users/${user._id}`)
        .then(() => {
          alert('User deleted');
          onDeleteUser(user._id); // Update parent component after deletion
        })
        .catch(error => {
          console.error("Error deleting user", error);
          alert('Error deleting the user');
        })
        .finally(() => setIsUpdating(false)); // Reset loading state
    }
  };

  // Edit user (redirects to edit page)
  const handleEdit = () => {
    window.location.href = `/edit-user/${user._id}`;
  };

  return (
    <tr>
      <td>{user.firstName} {user.lastName}</td>
      <td>{user.email}</td>
      <td>{user.userType}</td>
      <td>{user.isActive ? 'Active' : 'Inactive'}</td>
      <td>
        <button onClick={handleActivateDeactivate} disabled={isUpdating}>
          {user.isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button onClick={handleEdit} disabled={isUpdating}>
          Edit
        </button>
        <button onClick={handleDelete} disabled={isUpdating}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default UserItem;
