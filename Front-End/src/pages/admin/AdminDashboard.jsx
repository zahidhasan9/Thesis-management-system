import { useEffect, useState } from "react"
import axios from "../../api/axios"
import { toast } from "sonner"

export default function AdminDashboard() {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [roleChange, setRoleChange] = useState({})

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get("/admin/users")
      setUsers(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Change role
  const handleRoleChange = async (userId, role) => {
    try {
      const res = await axios.patch("/admin/role", { userId, role })
      toast.success(`Role updated to ${res.data.role}`)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || "Role update failed")
    }
  }

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return

    try {
      await axios.delete(`/admin/user/${userId}`)
      toast.success("User deleted successfully")
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed")
    }
  }

  if (loading) return <p className="p-10">Loading...</p>

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Admin Dashboard</h1>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="text-center">
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.phone || "-"}</td>
              <td className="p-2 border">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="border p-1"
                >
                  <option value="student">Student</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="evaluator">Evaluator</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-2 border">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}