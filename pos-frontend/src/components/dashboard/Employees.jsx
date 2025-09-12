import React, { useEffect, useState } from "react";
import { getUsers } from "../../https"; // adjust path if needed
import { enqueueSnackbar } from "notistack";

const Metrics = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        if (res.data.success) {
          setUsers(res.data.data);
        } else {
          enqueueSnackbar("Failed to fetch users", { variant: "error" });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error fetching users", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-gray-600">No users found.</p>
      </div>
    );
  }

  return (
    <div className="container px-6 py-4 mx-auto md:px-4">
      <h2 className="mb-4 text-xl font-semibold text-white">Employees</h2>

      {/* Table for tablets/desktops */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse rounded-lg shadow-md">
          <thead>
            <tr className="bg-[#1a1a1a] text-left text-sm font-medium text-white">
              <th className="px-4 py-3 border-b">Name</th>
              <th className="px-4 py-3 border-b">Email</th>
              <th className="px-4 py-3 border-b">Role</th>
              <th className="px-4 py-3 border-b">Created At</th>
              <th className="px-4 py-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="text-sm text-white transition-colors">
                <td className="px-4 py-3 border-b">{u.name}</td>
                <td className="px-4 py-3 border-b">{u.email}</td>
                <td className="px-4 py-3 border-b">{u.role || "Employee"}</td>
                <td className="px-4 py-3 border-b">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 border-b">Delete Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="space-y-3 md:hidden">
        {users.map((u) => (
          <div key={u._id} className="p-4 bg-white border rounded-lg shadow-sm">
            <p className="font-medium text-gray-800">
              {u.firstName} {u.lastName}
            </p>
            <p className="text-sm text-gray-600">{u.email}</p>
            <p className="mt-1 text-xs text-gray-500">
              Role: {u.role || "Employee"}
            </p>
            <p className="text-xs text-gray-400">
              Joined: {new Date(u.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Metrics;
