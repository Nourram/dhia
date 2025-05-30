"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const UserList = () => {
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })
        setUsers(response.data)
      } catch (error) {
        setError("Error fetching users")
      }
    }

    fetchUsers()
  }, [])

  const handleToggleStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/users/${id}/status`,
        { status: !status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        },
      )
      setUsers(users.map((user) => (user._id === id ? { ...user, status: !status } : user)))
    } catch (error) {
      setError("Error updating user status")
    }
  }

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })
      setUsers(users.filter((user) => user._id !== id))
    } catch (error) {
      setError("Error deleting user")
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-pink-600">👥 User List</h2>
      
      {error && (
        <div className="mb-4 p-3 rounded-md bg-rose-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-pink-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-sm">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-pink-50 dark:hover:bg-gray-700 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.nom} {user.prenom}
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 capitalize">{user.userType}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full 
                      ${user.status
                        ? "bg-green-50 text-green-600"
                        : "bg-rose-50 text-rose-600"}`}
                  >
                    {user.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleToggleStatus(user._id, user.status)}
                    className={`px-4 py-1 rounded-full text-sm font-semibold shadow-sm transition duration-200
                      ${user.status
                        ? "bg-rose-50 hover:bg-rose-100 text-rose-600"
                        : "bg-green-50 hover:bg-green-100 text-green-600"}`}
                  >
                    {user.status ? "Deactivate 🔴" : "Activate 🟢"}
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="px-4 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full text-sm font-semibold shadow-sm transition duration-200"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserList
