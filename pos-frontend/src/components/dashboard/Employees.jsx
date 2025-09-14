import React, { useEffect, useState } from "react";
import { getUsers, updateUser, deleteUser } from "../../https"; // adjust path if needed
import { enqueueSnackbar } from "notistack";

// Icon
import { IoMdClose } from "react-icons/io";

// Animation
import { motion } from "framer-motion";

const Metrics = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newPassword, setNewPassword] = useState("");

  const [search, setSearch] = useState(""); // ✅ search state

  // Open Edit Modal
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  // Open Delete Modal
  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      setIsSaveLoading(true);
      // build payload
      const payload = { ...selectedUser };
      if (newPassword.trim()) {
        payload.password = newPassword; // ✅ only include if user typed something
      }
      console.log(payload);

      const res = await updateUser(selectedUser._id, payload); // ✅ call API
      if (res.data.success) {
        enqueueSnackbar("User updated successfully", { variant: "success" });
        setUsers((prev) =>
          prev.map((u) => (u._id === selectedUser._id ? res.data.data : u))
        );
        setIsEditOpen(false);
        setNewPassword(""); // ✅ clear after save
      } else {
        enqueueSnackbar("Failed to update user", { variant: "error" });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Error updating user", { variant: "error" });
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await deleteUser(selectedUser._id);
      if (res.data.success) {
        enqueueSnackbar("User deleted successfully", { variant: "success" });

        // ✅ remove deleted user from state
        setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));

        setIsDeleteOpen(false);
        setSelectedUser(null); // ✅ clear selected user
      } else {
        enqueueSnackbar("Failed to delete user", { variant: "error" });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Error deleting user", { variant: "error" });
    }
  };

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

  // ✅ Filter users based on search input
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container px-6 py-6 mx-auto bg-[#262626] rounded-xl shadow-lg">
      {/* Header + Search */}
      <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-semibold text-[#f5f5f5]">Employees</h2>
          <p className="text-sm text-[#ababab]">
            Manage all employees, their roles, and account information.
          </p>
        </div>
        {/* ✅ Search Bar */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="px-4 py-2 text-sm rounded-lg bg-[#2d2d2d] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* ==================== DESKTOP TABLE ==================== */}
      <div className="hidden overflow-x-auto border border-gray-700 rounded-lg md:block">
        <table className="w-full text-left text-sm text-[#f5f5f5]">
          <thead className="bg-[#333] text-[#ababab] uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u, i) => (
                <tr
                  key={u._id}
                  className={`transition-colors ${
                    i % 2 === 0 ? "bg-[#2d2d2d]" : "bg-[#262626]"
                  } hover:bg-[#3a3a3a]`}
                >
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        u.role === "Admin"
                          ? "bg-blue-600/80 text-white"
                          : "bg-green-600/80 text-white"
                      }`}
                    >
                      {u.role || "Employee"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 space-x-2 text-center">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-3 py-1 text-xs font-medium text-black transition-colors rounded-md bg-primary hover:bg-accent"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="px-3 py-1 text-xs font-medium text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                  No users match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* ==================== MOBILE CARDS ==================== */}
      <div className="space-y-3 md:hidden">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div
              key={u._id}
              className="p-4 rounded-lg shadow-sm bg-[#2d2d2d] border border-gray-700"
            >
              <p className="font-medium text-white">{u.name}</p>
              <p className="text-sm text-gray-400">{u.email}</p>
              <p className="mt-1 text-xs text-gray-400">
                Role:{" "}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    u.role === "Admin"
                      ? "bg-blue-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {u.role || "Employee"}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Joined: {new Date(u.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleDelete(u)}
                  className="flex-1 px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(u)}
                  className="flex-1 px-3 py-1 text-xs font-medium text-black bg-yellow-400 rounded-md hover:bg-yellow-500"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="py-4 text-sm text-center text-gray-400">
            No users match your search.
          </p>
        )}
      </div>
      {/* ==================== EDIT MODAL ==================== */}

      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-[#262626] p-6 rounded-lg shadow-lg w-[90%] max-w-md"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#f5f5f5] text-xl font-semibold truncate">
                Add Dish
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-[#f5f5f5] hover:text-red-500 flex-shrink-0"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(); // ✅ call update function
              }}
            >
              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">
                  Name
                </label>
                <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                  <input
                    type="text"
                    name="name"
                    value={selectedUser?.name || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        name: e.target.value,
                      })
                    }
                    className="flex-1 text-white bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">
                  Email
                </label>
                <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                  <input
                    type="email"
                    name="email"
                    value={selectedUser?.email || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                    className="flex-1 text-white bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">
                  Phone Number
                </label>
                <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                  <input
                    type="number"
                    name="email"
                    value={selectedUser?.phone || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                    className="flex-1 text-white bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">
                  Password
                </label>
                <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                  <input
                    type="password"
                    name="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 text-white bg-transparent focus:outline-none"
                    placeholder="New Password (optional)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">
                  Role
                </label>
                <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                  <select
                    value={selectedUser?.role || "Employee"}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, role: e.target.value })
                    }
                    className="flex-1 text-white bg-transparent focus:outline-none"
                  >
                    <option className="bg-[#1f1f1f] text-white" value="Chef">
                      Chef
                    </option>
                    <option className="bg-[#1f1f1f] text-white" value="Waiter">
                      Waiter
                    </option>
                    <option className="bg-[#1f1f1f] text-white" value="Cashier">
                      Cashier
                    </option>
                    <option className="bg-[#1f1f1f] text-white" value="Admin">
                      Admin
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="submit"
                  className="w-full py-3 mt-6 text-lg font-bold text-gray-900 rounded-lg bg-primary"
                >
                  {isSaveLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* ==================== DELETE MODAL ==================== */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#1a1a1a] rounded-lg shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-[#f5f5f5] mb-4">
              Delete Employee
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              Are you sure you want to delete{" "}
              <span className="font-medium text-white">
                {selectedUser?.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteUser();
                }}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Metrics;
