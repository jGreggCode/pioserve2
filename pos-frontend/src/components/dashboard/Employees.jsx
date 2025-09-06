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
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-600">No users found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-6 md:px-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Employees</h2>

      {/* Table for tablets/desktops */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse rounded-lg shadow-md">
          <thead>
            <tr className="bg-[#1a1a1a] text-left text-sm font-medium text-white">
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Role</th>
              <th className="py-3 px-4 border-b">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="text-white transition-colors text-sm"
              >
                <td className="py-3 px-4 border-b">
                  {u.name}
                </td>
                <td className="py-3 px-4 border-b">{u.email}</td>
                <td className="py-3 px-4 border-b">{u.role || "Employee"}</td>
                <td className="py-3 px-4 border-b">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="md:hidden space-y-3">
        {users.map((u) => (
          <div
            key={u._id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <p className="font-medium text-gray-800">
              {u.firstName} {u.lastName}
            </p>
            <p className="text-gray-600 text-sm">{u.email}</p>
            <p className="text-gray-500 text-xs mt-1">
              Role: {u.role || "Employee"}
            </p>
            <p className="text-gray-400 text-xs">
              Joined: {new Date(u.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Metrics;
