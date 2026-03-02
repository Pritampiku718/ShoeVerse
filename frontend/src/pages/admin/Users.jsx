import { useState, useEffect, useMemo } from "react";
import { useAdminStore } from "../../store/adminStore";
import { useAuthStore } from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  FiSearch,
  FiUserCheck,
  FiUserX,
  FiDownload,
  FiShield,
  FiMail,
  FiCalendar,
  FiShoppingBag,
  FiDollarSign,
  FiStar,
  FiEye,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTrendingUp,
  FiUsers,
  FiX,
  FiRefreshCw,
  FiAward,
  FiLock,
  FiUnlock,
  FiUserPlus,
  FiUserMinus,
  FiSettings,
  FiActivity,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiCreditCard,
  FiGift,
  FiZap,
  FiPieChart,
  FiBarChart2,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

const Users = () => {
  const {
    users = [],
    fetchUsers,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    getUserDetails,
    getUserActivity,
    isLoading = false,
  } = useAdminStore();

  const { user: currentUser } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showRoleChangeConfirm, setShowRoleChangeConfirm] = useState(false);
  const [roleChangeData, setRoleChangeData] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userActivity, setUserActivity] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // The admin user who logged in is permanently admin
  const isPermanentAdmin = (userId) => {
    return userId === currentUser?._id;
  };

  // Count total admins including the current user
  const adminCount = useMemo(() => {
    return users.filter((u) => u && u.role === "admin").length;
  }, [users]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLocalLoading(true);
    setApiError(false);
    try {
      await fetchUsers();
    } catch (error) {
      console.error("Error loading users:", error);
      setApiError(true);
      toast.error("Failed to load users from database");
    } finally {
      setLocalLoading(false);
    }
  };

  const refreshUsers = async () => {
    setRefreshing(true);
    await loadUsers();
    setTimeout(() => setRefreshing(false), 1000);
    toast.success("Users refreshed successfully");
  };

  // Safe access to users array
  const safeUsers = useMemo(() => (Array.isArray(users) ? users : []), [users]);

  // Real-time stats from database with safe checks
  const userStatsData = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      total: safeUsers.length,
      active: safeUsers.filter((u) => u && !u.isBlocked).length,
      blocked: safeUsers.filter((u) => u && u.isBlocked).length,
      admins: adminCount,
      newThisMonth: safeUsers.filter((u) => {
        if (!u || !u.createdAt) return false;
        const date = new Date(u.createdAt);
        const now = new Date();
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }).length,
      newThisWeek: safeUsers.filter((u) => {
        if (!u || !u.createdAt) return false;
        const date = new Date(u.createdAt);
        return date > weekAgo;
      }).length,
    };
  }, [safeUsers, adminCount]);

  const filteredUsers = useMemo(() => {
    return safeUsers.filter((user) => {
      if (!user) return false;

      const matchesSearch =
        (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user._id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.phone?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !user.isBlocked) ||
        (statusFilter === "blocked" && user.isBlocked);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [safeUsers, searchTerm, roleFilter, statusFilter]);

  // Sort users
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (sortConfig.key === "createdAt") {
        return sortConfig.direction === "asc"
          ? new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
          : new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortConfig.key === "name") {
        return sortConfig.direction === "asc"
          ? (a.name || "").localeCompare(b.name || "")
          : (b.name || "").localeCompare(a.name || "");
      }
      if (sortConfig.key === "orderCount") {
        return sortConfig.direction === "asc"
          ? (a.orderCount || 0) - (b.orderCount || 0)
          : (b.orderCount || 0) - (a.orderCount || 0);
      }
      if (sortConfig.key === "totalSpent") {
        return sortConfig.direction === "asc"
          ? (a.totalSpent || 0) - (b.totalSpent || 0)
          : (b.totalSpent || 0) - (a.totalSpent || 0);
      }
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setShowUserModal(true);

    const loadingToast = toast.loading("Loading user details...");

    try {
      const activity = await getUserActivity(user._id, 10);
      setUserActivity(activity || []);

      const analytics = {
        totalOrders: user.orderCount || 0,
        totalSpent: user.totalSpent || 0,
        averageOrderValue: user.orderCount
          ? ((user.totalSpent || 0) / user.orderCount).toFixed(2)
          : 0,
        favoriteCategory: user.favoriteCategory || "Running",
        lastActive: user.lastLogin
          ? new Date(user.lastLogin).toLocaleDateString()
          : "Never",
        memberSince: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "N/A",
        accountAge: user.createdAt
          ? Math.floor(
              (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24),
            )
          : 0,
        reviewCount: user.reviewCount || 0,
        wishlistCount: user.wishlistCount || 0,
      };
      setUserStats(analytics);

      const mockOrders = [
        {
          id: "ORD-001",
          date: "2024-02-15",
          total: 245.99,
          status: "delivered",
          items: 2,
        },
        {
          id: "ORD-002",
          date: "2024-02-10",
          total: 129.5,
          status: "delivered",
          items: 1,
        },
        {
          id: "ORD-003",
          date: "2024-02-05",
          total: 389.99,
          status: "processing",
          items: 3,
        },
      ].slice(0, user.orderCount || 3);
      setUserOrders(mockOrders);

      toast.dismiss(loadingToast);
      toast.success("User details loaded successfully");
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to load some user details");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (isPermanentAdmin(userId)) {
      toast.error("You cannot delete your own admin account");
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      return;
    }

    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (isPermanentAdmin(userId)) {
      toast.error("You cannot change your own admin role");
      return;
    }

    if (newRole === "admin") {
      setRoleChangeData({ userId, newRole });
      setShowRoleChangeConfirm(true);
      return;
    }

    try {
      await updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const confirmRoleChange = async () => {
    if (!roleChangeData) return;

    try {
      await updateUserRole(roleChangeData.userId, roleChangeData.newRole);
      toast.success(`User promoted to admin successfully`);
    } catch (error) {
      toast.error("Failed to update user role");
    } finally {
      setShowRoleChangeConfirm(false);
      setRoleChangeData(null);
    }
  };

  const handleToggleStatus = async (userId, isBlocked) => {
    if (isPermanentAdmin(userId)) {
      toast.error("You cannot block your own admin account");
      return;
    }

    try {
      await toggleUserStatus(userId, isBlocked);
      toast.success(`User ${isBlocked ? "blocked" : "unblocked"} successfully`);
    } catch (error) {
      toast.error(`Failed to ${isBlocked ? "block" : "unblock"} user`);
    }
  };

  const handleExportUsers = () => {
    if (safeUsers.length === 0) {
      toast.error("No users to export");
      return;
    }

    const exportData = safeUsers.map((user) => ({
      "User ID": user._id || "",
      Name: user.name || "",
      Email: user.email || "",
      Phone: user.phone || "",
      Role: user.role || "user",
      Status: user.isBlocked ? "Blocked" : "Active",
      Joined: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "",
      "Last Login": user.lastLogin
        ? new Date(user.lastLogin).toLocaleDateString()
        : "Never",
      "Total Orders": user.orderCount || 0,
      "Total Spent": `$${user.totalSpent || 0}`,
      Reviews: user.reviewCount || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(
      wb,
      `shoeverse-users-${new Date().toISOString().split("T")[0]}.xlsx`,
    );

    toast.success("Users exported successfully");
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      toast.error("No users selected");
      return;
    }

    const validUsers = selectedUsers.filter((id) => !isPermanentAdmin(id));

    if (validUsers.length === 0) {
      toast.error(
        "No valid users selected for this action (cannot modify your own account)",
      );
      return;
    }

    try {
      if (action === "block") {
        await Promise.all(validUsers.map((id) => toggleUserStatus(id, true)));
        toast.success(`${validUsers.length} users blocked`);
      } else if (action === "unblock") {
        await Promise.all(validUsers.map((id) => toggleUserStatus(id, false)));
        toast.success(`${validUsers.length} users unblocked`);
      }
      setSelectedUsers([]);
      setShowBulkActions(false);
    } catch (error) {
      toast.error("Failed to perform bulk action");
    }
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent rounded-full" />
          </motion.div>
          <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="text-red-600 text-4xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Failed to Load Users
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Unable to connect to the server. Please check your backend.
          </p>
          <button
            onClick={loadUsers}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Management - ShoeVerse Admin</title>
      </Helmet>

      {/* Main Container */}
      <div className="w-full max-w-full overflow-x-hidden px-2 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FiUsers className="text-primary-400 text-xl sm:text-2xl" />
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
                    Users
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-gray-300">
                  {userStatsData.total > 0
                    ? `${userStatsData.total} users · ${userStatsData.active} active · ${userStatsData.admins} admins`
                    : "No users found"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={refreshUsers}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white/90 hover:text-white"
                  title="Refresh"
                >
                  <FiRefreshCw
                    className={refreshing ? "animate-spin" : ""}
                    size={16}
                  />
                </button>

                <button
                  onClick={handleExportUsers}
                  disabled={safeUsers.length === 0}
                  className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs flex items-center gap-1 disabled:opacity-50"
                >
                  <FiDownload size={14} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 sm:p-4 text-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <FiUsers size={16} className="opacity-90" />
                <span className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wide">
                  Total
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-white">
                {userStatsData.total}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 sm:p-4 text-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <FiUserCheck size={16} className="opacity-90" />
                <span className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wide">
                  Active
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-white">
                {userStatsData.active}
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-3 sm:p-4 text-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <FiUserX size={16} className="opacity-90" />
                <span className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wide">
                  Blocked
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-white">
                {userStatsData.blocked}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 sm:p-4 text-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <FiShield size={16} className="opacity-90" />
                <span className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wide">
                  Admins
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-white">
                {userStatsData.admins}
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-3 sm:p-4 text-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <FiTrendingUp size={16} className="opacity-90" />
                <span className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wide">
                  New Month
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-white">
                {userStatsData.newThisMonth}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-3 sm:p-4 text-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <FiClock size={16} className="opacity-90" />
                <span className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wide">
                  New Week
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-white">
                {userStatsData.newThisWeek}
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-3 sm:p-4 text-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <FiStar size={16} className="opacity-90" />
                <span className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wide">
                  Active %
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-white">
                {(
                  (userStatsData.active / (userStatsData.total || 1)) *
                  100
                ).toFixed(0)}
                %
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex-1 min-w-[200px] relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <select
                value={`${sortConfig.key}-${sortConfig.direction}`}
                onChange={(e) => {
                  const [key, direction] = e.target.value.split("-");
                  setSortConfig({ key, direction });
                }}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="orderCount-desc">Most Orders</option>
                <option value="totalSpent-desc">Highest Spent</option>
              </select>
              {selectedUsers.length > 0 && (
                <button
                  onClick={() => setShowBulkActions(true)}
                  className="px-3 py-2 bg-primary-600 text-white rounded-lg text-xs flex items-center gap-1"
                >
                  <FiZap size={12} />
                  Bulk ({selectedUsers.length})
                </button>
              )}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {safeUsers.length === 0 ? (
              <div className="text-center py-12">
                <FiUsers className="mx-auto text-gray-400 dark:text-gray-500 text-4xl mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No users found
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedUsers.length === currentUsers.length &&
                            currentUsers.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(currentUsers.map((u) => u._id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-12">
                          <div className="flex justify-center">
                            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                          </div>
                        </td>
                      </tr>
                    ) : sortedUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-12 text-gray-500 dark:text-gray-400"
                        >
                          <FiUsers className="mx-auto mb-3 text-4xl opacity-30 dark:opacity-20" />
                          <p className="text-sm">
                            No users found matching your criteria
                          </p>
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user) => {
                        const isCurrentUser = isPermanentAdmin(user._id);

                        return (
                          <tr
                            key={user._id}
                            className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group ${
                              isCurrentUser
                                ? "bg-primary-50/50 dark:bg-primary-900/10"
                                : ""
                            }`}
                          >
                            <td className="px-4 py-4 align-middle">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUsers([
                                      ...selectedUsers,
                                      user._id,
                                    ]);
                                  } else {
                                    setSelectedUsers(
                                      selectedUsers.filter(
                                        (id) => id !== user._id,
                                      ),
                                    );
                                  }
                                }}
                                disabled={isCurrentUser}
                                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                              />
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <div className="flex items-center gap-3">
                                <div className="relative flex-shrink-0">
                                  <div
                                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                                      user.role === "admin"
                                        ? "from-primary-600 to-accent"
                                        : "from-gray-600 to-gray-500"
                                    } flex items-center justify-center text-white font-bold text-base shadow-lg`}
                                  >
                                    {user.name?.charAt(0).toUpperCase() || "?"}
                                  </div>
                                  <div
                                    className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                                      user.isBlocked
                                        ? "bg-red-500"
                                        : "bg-green-500"
                                    }`}
                                  />
                                  {isCurrentUser && (
                                    <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                                      <FiAward
                                        size={8}
                                        className="text-white"
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className="text-sm font-semibold text-gray-900 dark:text-white"
                                      title={user.name}
                                    >
                                      {user.name || "Unnamed"}
                                    </span>
                                    {isCurrentUser && (
                                      <span className="px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-[10px] rounded-full font-medium whitespace-nowrap">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <span
                                    className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5"
                                    title={user.email}
                                  >
                                    <FiMail
                                      size={10}
                                      className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                                    />
                                    <span className="truncate max-w-[180px]">
                                      {user.email || "No email"}
                                    </span>
                                  </span>
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">
                                    ID: {user._id?.slice(-6) || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              {isCurrentUser ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 whitespace-nowrap">
                                  <FiAward size={12} />
                                  Admin
                                </span>
                              ) : (
                                <div className="min-w-[85px]">
                                  <select
                                    value={user.role || "user"}
                                    onChange={(e) =>
                                      handleRoleChange(user._id, e.target.value)
                                    }
                                    className={`text-[11px] px-3 py-1.5 rounded-full border-0 font-medium appearance-none cursor-pointer w-full text-center ${
                                      user.role === "admin"
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
                                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                                    } focus:outline-none focus:ring-1 focus:ring-primary-500`}
                                    style={{
                                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                      backgroundPosition: "right 6px center",
                                      backgroundRepeat: "no-repeat",
                                      backgroundSize: "12px",
                                      paddingRight: "24px",
                                    }}
                                  >
                                    <option
                                      value="user"
                                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    >
                                      👤 User
                                    </option>
                                    <option
                                      value="admin"
                                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    >
                                      🛡️ Admin
                                    </option>
                                  </select>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <div className="min-w-[75px]">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold w-full justify-center whitespace-nowrap ${
                                    user.isBlocked
                                      ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                                      : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                                  }`}
                                >
                                  {user.isBlocked ? (
                                    <FiLock size={12} />
                                  ) : (
                                    <FiUnlock size={12} />
                                  )}
                                  {user.isBlocked ? "Blocked" : "Active"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap min-w-[110px]">
                                <FiCalendar
                                  size={14}
                                  className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                                />
                                {user.createdAt
                                  ? new Date(user.createdAt).toLocaleDateString(
                                      "en-US",
                                      {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      },
                                    )
                                  : "N/A"}
                              </div>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <div className="flex items-center gap-2 min-w-[100px]">
                                <div
                                  className="flex items-center gap-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1 whitespace-nowrap"
                                  title="Orders"
                                >
                                  <FiShoppingBag
                                    size={12}
                                    className="text-blue-500"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    {user.orderCount || 0}
                                  </span>
                                </div>
                                <div
                                  className="flex items-center gap-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1 whitespace-nowrap"
                                  title="Total Spent"
                                >
                                  <FiDollarSign
                                    size={12}
                                    className="text-green-500"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    ${user.totalSpent || 0}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <div className="flex items-center justify-end gap-2 min-w-[100px]">
                                <button
                                  onClick={() => handleViewUser(user)}
                                  className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all hover:scale-110 transform duration-200"
                                  title="View Details"
                                >
                                  <FiEye size={18} />
                                </button>

                                {!isCurrentUser && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setUserToDelete(user);
                                        setShowDeleteConfirm(true);
                                      }}
                                      className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all hover:scale-110 transform duration-200"
                                      title="Delete User"
                                    >
                                      <FiTrash2 size={18} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleToggleStatus(
                                          user._id,
                                          !user.isBlocked,
                                        )
                                      }
                                      className={`p-1.5 rounded-lg transition-all hover:scale-110 transform duration-200 ${
                                        user.isBlocked
                                          ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
                                          : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                                      }`}
                                      title={
                                        user.isBlocked
                                          ? "Unblock User"
                                          : "Block User"
                                      }
                                    >
                                      {user.isBlocked ? (
                                        <FiUserCheck size={18} />
                                      ) : (
                                        <FiUserX size={18} />
                                      )}
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, sortedUsers.length)} of{" "}
                  {sortedUsers.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="p-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <FiChevronLeft size={14} />
                  </button>
                  <span className="text-xs px-2 text-gray-700 dark:text-gray-300 font-medium">
                    {currentPage}/{totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <FiChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* All modals */}
          <AnimatePresence>
            {showUserModal && selectedUser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowUserModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-accent p-8 text-white">
                    <div className="absolute inset-0 bg-grid-white/5"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl font-bold border-4 border-white/50 shadow-2xl">
                            {selectedUser.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div
                            className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${
                              selectedUser.isBlocked
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          />
                          {selectedUser.role === "admin" && (
                            <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-2">
                              <FiAward size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">
                            {selectedUser.name || "Unnamed"}
                          </h2>
                          <p className="text-white/80 text-lg">
                            {selectedUser.email || "No email"}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <span
                              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                                selectedUser.role === "admin"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-white/10 text-white"
                              }`}
                            >
                              {selectedUser.role === "admin"
                                ? "🛡️ Admin"
                                : "👤 User"}
                            </span>
                            <span
                              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                                selectedUser.isBlocked
                                  ? "bg-red-500/20 text-red-200"
                                  : "bg-green-500/20 text-green-200"
                              }`}
                            >
                              {selectedUser.isBlocked ? "Blocked" : "Active"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowUserModal(false)}
                        className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
                      >
                        <FiX size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                    
                    {/* Stats Grid */}
                    {userStats && (
                      <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                          <div className="flex items-center justify-between mb-2">
                            <FiShoppingBag size={20} />
                            <span className="text-2xl font-bold">
                              {userStats.totalOrders}
                            </span>
                          </div>
                          <p className="text-xs opacity-90">Total Orders</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                          <div className="flex items-center justify-between mb-2">
                            <FiDollarSign size={20} />
                            <span className="text-2xl font-bold">
                              ${userStats.totalSpent}
                            </span>
                          </div>
                          <p className="text-xs opacity-90">Total Spent</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                          <div className="flex items-center justify-between mb-2">
                            <FiShoppingCart size={20} />
                            <span className="text-2xl font-bold">
                              ${userStats.averageOrderValue}
                            </span>
                          </div>
                          <p className="text-xs opacity-90">Avg Order Value</p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
                          <div className="flex items-center justify-between mb-2">
                            <FiHeart size={20} />
                            <span className="text-2xl font-bold">
                              {userStats.wishlistCount}
                            </span>
                          </div>
                          <p className="text-xs opacity-90">Wishlist Items</p>
                        </div>
                      </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                      {[
                        { id: "overview", label: "Overview", icon: FiPieChart },
                        { id: "orders", label: "Orders", icon: FiShoppingBag },
                        { id: "activity", label: "Activity", icon: FiActivity },
                        {
                          id: "analytics",
                          label: "Analytics",
                          icon: FiBarChart2,
                        },
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium capitalize transition-all relative ${
                              isActive
                                ? "text-primary-600 dark:text-primary-400"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                          >
                            <Icon size={16} />
                            {tab.label}
                            {isActive && (
                              <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Overview Tab */}
                    {activeTab === "overview" && userStats && (
                      <div className="space-y-6">
                        
                        {/* User Details Grid */}
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                              <FiUser className="text-primary-500" />
                              Personal Information
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                                  <FiUser
                                    className="text-primary-600"
                                    size={16}
                                  />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Full Name
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {selectedUser.name || "N/A"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                                  <FiMail
                                    className="text-primary-600"
                                    size={16}
                                  />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Email Address
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {selectedUser.email || "N/A"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                                  <FiPhone
                                    className="text-primary-600"
                                    size={16}
                                  />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Phone Number
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {selectedUser.phone || "Not provided"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                              <FiSettings className="text-primary-500" />
                              Account Details
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                                  <FiCalendar
                                    className="text-primary-600"
                                    size={16}
                                  />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Member Since
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {userStats.memberSince} (
                                    {userStats.accountAge} days)
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                                  <FiClock
                                    className="text-primary-600"
                                    size={16}
                                  />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Last Login
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {userStats.lastActive}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                                  <FiStar
                                    className="text-primary-600"
                                    size={16}
                                  />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Favorite Category
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {userStats.favoriteCategory}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === "orders" && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          Recent Orders
                        </h3>
                        {userOrders.length > 0 ? (
                          <div className="space-y-3">
                            {userOrders.map((order, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                                    <FiShoppingBag
                                      className="text-primary-600"
                                      size={20}
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {order.id}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {order.date} • {order.items} items
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-primary-600">
                                    ${order.total}
                                  </p>
                                  <span
                                    className={`text-xs px-3 py-1 rounded-full ${
                                      order.status === "delivered"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        : order.status === "cancelled"
                                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                          : order.status === "shipped"
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            No orders yet
                          </p>
                        )}
                      </div>
                    )}

                    {/* Activity Tab */}
                    {activeTab === "activity" && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          Recent Activity
                        </h3>
                        <div className="space-y-3">
                          {userActivity.length > 0 ? (
                            userActivity.map((activity, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                                  <FiActivity
                                    className="text-primary-600"
                                    size={20}
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {activity.action}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {activity.details || "No details"}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {activity.time}
                                  </p>
                                  {activity.ip && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                      {activity.ip}
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                              No recent activity
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === "analytics" && userStats && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                              Order Analytics
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Total Orders
                                </span>
                                <span className="text-lg font-bold text-primary-600">
                                  {userStats.totalOrders}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Average Order Value
                                </span>
                                <span className="text-lg font-bold text-green-600">
                                  ${userStats.averageOrderValue}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Total Spent
                                </span>
                                <span className="text-lg font-bold text-purple-600">
                                  ${userStats.totalSpent}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                              Engagement Metrics
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Reviews Written
                                </span>
                                <span className="text-lg font-bold text-yellow-600">
                                  {userStats.reviewCount}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Wishlist Items
                                </span>
                                <span className="text-lg font-bold text-pink-600">
                                  {userStats.wishlistCount}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Account Age
                                </span>
                                <span className="text-lg font-bold text-blue-600">
                                  {userStats.accountAge} days
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Activity Timeline */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                            Activity Timeline
                          </h4>
                          <div className="space-y-4">
                            <div className="relative pl-8 pb-4 border-l-2 border-primary-200 dark:border-primary-800">
                              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary-500"></div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Account Created
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {userStats.memberSince}
                              </p>
                            </div>
                            {userStats.lastActive !== "Never" && (
                              <div className="relative pl-8 pb-4 border-l-2 border-primary-200 dark:border-primary-800">
                                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Last Login
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {userStats.lastActive}
                                </p>
                              </div>
                            )}
                            {userStats.totalOrders > 0 && (
                              <div className="relative pl-8">
                                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  First Order Placed
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {userOrders[0]?.date || "N/A"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex gap-3">
                      {!isPermanentAdmin(selectedUser._id) && (
                        <>
                          <button
                            onClick={() => {
                              handleToggleStatus(
                                selectedUser._id,
                                !selectedUser.isBlocked,
                              );
                              setShowUserModal(false);
                            }}
                            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 transform duration-200 ${
                              selectedUser.isBlocked
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                          >
                            {selectedUser.isBlocked
                              ? "Unblock User"
                              : "Block User"}
                          </button>
                          <button
                            onClick={() => {
                              setUserToDelete(selectedUser);
                              setShowUserModal(false);
                              setShowDeleteConfirm(true);
                            }}
                            className="flex-1 px-6 py-3 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors hover:scale-105 transform duration-200"
                          >
                            Delete User
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setShowUserModal(false)}
                        className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors hover:scale-105 transform duration-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && userToDelete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <FiAlertCircle className="text-red-600 text-3xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Delete User
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-red-600">
                      {userToDelete.name || "this user"}
                    </span>
                    ? All user data including orders, reviews, and personal
                    information will be permanently removed.
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg font-medium hover:scale-105 transform duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteUser(userToDelete._id)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all text-lg font-medium shadow-lg hover:scale-105 transform duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Role Change Confirmation Modal */}
          <AnimatePresence>
            {showRoleChangeConfirm && roleChangeData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowRoleChangeConfirm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                      <FiShield className="text-yellow-600 text-3xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Promote to Admin?
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        This will grant administrative privileges
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                    Are you sure you want to promote this user to admin? They
                    will have access to manage products, orders, and users.
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowRoleChangeConfirm(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg font-medium hover:scale-105 transform duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmRoleChange}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent hover:from-primary-700 hover:to-accent-dark text-white rounded-xl transition-all text-lg font-medium shadow-lg hover:scale-105 transform duration-200"
                    >
                      Confirm
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk Actions Modal */}
          <AnimatePresence>
            {showBulkActions && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowBulkActions(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                      <FiZap className="text-primary-600 text-3xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Bulk Actions
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedUsers.length} users selected
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <button
                      onClick={() => handleBulkAction("block")}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:scale-105 transform duration-200"
                    >
                      <span className="flex items-center gap-3">
                        <FiUserX className="text-red-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Block Selected Users
                        </span>
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ⛔
                      </span>
                    </button>
                    <button
                      onClick={() => handleBulkAction("unblock")}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:scale-105 transform duration-200"
                    >
                      <span className="flex items-center gap-3">
                        <FiUserCheck className="text-green-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Unblock Selected Users
                        </span>
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ✅
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() => setShowBulkActions(false)}
                    className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors hover:scale-105 transform duration-200"
                  >
                    Cancel
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Users;
