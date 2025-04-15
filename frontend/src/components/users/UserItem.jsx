import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UserItem = ({ user, onUpdateUser, onDeleteUser }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleStatus = async () => {
    const newStatus = !user.status;
    const result = await Swal.fire({
      title: newStatus ? "Confirm Activation" : "Confirm Deactivation",
      text: newStatus
        ? "Are you sure you want to activate this user?"
        : "Are you sure you want to deactivate this user?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: newStatus ? "#3085d6" : "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: newStatus ? "Yes, activate" : "Yes, deactivate",
    });

    if (result.isConfirmed) {
      setIsUpdating(true);
      try {
        await axios.patch(
          `/api/users/${user._id}/status`,
          { status: newStatus },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }
        );
        onUpdateUser({ ...user, status: newStatus });
        Swal.fire("Success", `User ${newStatus ? "activated" : "deactivated"}`, "success");
      } catch (error) {
        console.error("Error updating status:", error);
        Swal.fire("Error", "Failed to update user status", "error");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this user? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      setIsUpdating(true);
      try {
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        onDeleteUser(user._id);
        Swal.fire("Deleted", "User has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire("Error", "Failed to delete user", "error");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleEdit = () => {
    window.location.href = `/edit-user/${user._id}`;
  };

  return (
    <tr className="hover:bg-pink-50 dark:hover:bg-gray-700 transition">
      <td className="px-6 py-4">{user.firstName} {user.lastName}</td>
      <td className="px-6 py-4">{user.email}</td>
      <td className="px-6 py-4">{user.userType}</td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full 
            ${user.status ? "bg-green-50 text-green-600" : "bg-rose-50 text-rose-600"}`}
        >
          {user.status ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-6 py-4 flex flex-wrap gap-2">
        <button
          onClick={handleToggleStatus}
          disabled={isUpdating}
          className={`px-4 py-1 rounded-full text-sm font-semibold shadow-sm transition duration-200
            ${user.status
              ? "bg-rose-50 hover:bg-rose-100 text-rose-600"
              : "bg-green-50 hover:bg-green-100 text-green-600"}`}
        >
          {isUpdating ? "Updating..." : user.status ? "Deactivate 🔴" : "Activate 🟢"}
        </button>
        <button
          onClick={handleEdit}
          disabled={isUpdating}
          className="px-4 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-sm font-semibold shadow-sm transition duration-200"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isUpdating}
          className="px-4 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full text-sm font-semibold shadow-sm transition duration-200"
        >
          🗑 Delete
        </button>
      </td>
    </tr>
  );
};

export default UserItem;