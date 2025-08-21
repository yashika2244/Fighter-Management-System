import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Shield, UserCheck, UserX, Key, Eye, EyeOff, Search } from 'lucide-react';

const roles = [
  "Writer",
  "CompanyCommander", 
  "CHM",
  "CQMH",
  "MessSO",
  "Commander",
  "SuperAdmin",
  "Other"
];

export default function AdminManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    role: 'Writer'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.role === 'SuperAdmin') {
      fetchUsers();
      fetchAllUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await api.get('/users');
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!formData.userId) {
      toast.error('Please select a user');
      return;
    }

    try {
      // Get the selected user details
      const selectedUser = allUsers.find(u => u._id === formData.userId);
      
      // Create the user account with the selected user's details
      await api.post('/admin/users', {
        forceNo: selectedUser.forceNo,
        name: selectedUser.name,
        password: formData.password,
        role: formData.role
      });
      
      toast.success('User account created successfully');
      setShowCreateModal(false);
      setFormData({ userId: '', password: '', role: 'Writer' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user account');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('Role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { active: !currentStatus });
      toast.success('Status updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = prompt('Enter new password:');
    if (!newPassword) return;
    
    try {
      await api.put(`/admin/users/${userId}/password`, { password: newPassword });
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const handleChangeOwnPassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      // First verify current password
      const loginResponse = await api.post('/auth/login', {
        forceNo: user.forceNo,
        password: passwordData.currentPassword
      });

      if (loginResponse.data.token) {
        // Update password
        await api.put(`/admin/users/${user.id}/password`, { 
          password: passwordData.newPassword 
        });
        toast.success('Password changed successfully');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Current password is incorrect');
      } else {
        toast.error('Failed to change password');
      }
    }
  };

  // Filter users for dropdown (exclude those who already have accounts)
  const availableUsers = allUsers.filter(user => 
    !users.some(adminUser => adminUser.forceNo === user.forceNo) &&
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.forceNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (user?.role !== 'SuperAdmin') {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          <Shield size={48} className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p>Only SuperAdmin can access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-700 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Key size={16} />
            <span>Change Password</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-cyan-700"
          >
            <Plus size={16} />
            <span>Create User Account</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Force Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-center">
                    <div className="text-lg font-bold text-cyan-700 bg-cyan-50 px-3 py-2 rounded-lg">
                      {user.forceNo}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">ID: {user._id}</div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                    className={`text-sm border rounded px-3 py-2 font-medium ${
                      user.role === 'SuperAdmin' 
                        ? 'border-purple-300 bg-purple-50 text-purple-700'
                        : user.role === 'Commander'
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : user.role === 'CompanyCommander'
                        ? 'border-orange-300 bg-orange-50 text-orange-700'
                        : 'border-gray-300 bg-gray-50 text-gray-700'
                    }`}
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    user.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.active ? '🟢 Active' : '🔴 Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleToggleStatus(user._id, user.active)}
                    className={`inline-flex items-center px-3 py-1 rounded text-xs ${
                      user.active 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {user.active ? <UserX size={12} /> : <UserCheck size={12} />}
                    {user.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleResetPassword(user._id)}
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-xs"
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create User Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create User Account</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select an existing employee and create a login account for them.
            </p>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Employee *</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or force number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <select
                  required
                  value={formData.userId}
                  onChange={(e) => setFormData({...formData, userId: e.target.value})}
                  className="mt-2 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="">Select an employee...</option>
                  {availableUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.forceNo} - {user.name}
                    </option>
                  ))}
                </select>
                {availableUsers.length === 0 && searchTerm && (
                  <p className="text-sm text-gray-500 mt-1">No available employees found</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Password *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Minimum 6 characters"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ userId: '', password: '', role: 'Writer' });
                    setSearchTerm('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handleChangeOwnPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password *</label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password *</label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Repeat new password"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
