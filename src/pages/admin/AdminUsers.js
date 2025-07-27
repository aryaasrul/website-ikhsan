// src/pages/admin/AdminUsers.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const { canManageUsers, profile: currentUserProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.role) {
        query = query.eq('role', filters.role);
      }

      if (filters.status === 'active') {
        query = query.eq('is_active', true);
      } else if (filters.status === 'inactive') {
        query = query.eq('is_active', false);
      }

      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    if (!canManageUsers()) {
      toast.error('You do not have permission to manage users');
      return;
    }

    if (userId === currentUserProfile?.id) {
      toast.error('You cannot change your own role');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Error updating user role');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    if (!canManageUsers()) {
      toast.error('You do not have permission to manage users');
      return;
    }

    if (userId === currentUserProfile?.id) {
      toast.error('You cannot deactivate your own account');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Error updating user status');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    if (!canManageUsers()) {
      toast.error('You do not have permission to manage users');
      return;
    }

    if (selectedUsers.includes(currentUserProfile?.id)) {
      toast.error('You cannot perform bulk actions on your own account');
      return;
    }

    const confirmMessage = {
      activate: 'Activate selected users?',
      deactivate: 'Deactivate selected users?',
      makeUser: 'Set selected users as regular users?',
      makeAdmin: 'Set selected users as admins?'
    };

    if (!window.confirm(confirmMessage[action])) return;

    try {
      let updateData = {};
      
      switch (action) {
        case 'activate':
          updateData = { is_active: true };
          break;
        case 'deactivate':
          updateData = { is_active: false };
          break;
        case 'makeUser':
          updateData = { role: 'user' };
          break;
        case 'makeAdmin':
          updateData = { role: 'admin' };
          break;
        default:
          return;
      }

      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .in('id', selectedUsers);

      if (error) throw error;

      toast.success(`${selectedUsers.length} users updated`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      console.error(`Error performing bulk action:`, error);
      toast.error(`Error performing bulk action`);
    }
  };

  const roles = [
    { value: '', label: 'All Roles' },
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'owner', label: 'Owner' }
  ];

  if (!canManageUsers()) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🚫</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You don't have permission to manage users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👥 Manage Users</h1>
          <p className="text-gray-600">View and manage user accounts and permissions</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            Total: {users.length} users
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Search Users
            </label>
            <input
              type="text"
              placeholder="Name or email..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              👤 Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ role: '', status: '', search: '' })}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              🗑️ Clear Filters
            </button>
          </div>
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              {selectedUsers.length} users selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                ✅ Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                ❌ Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('makeUser')}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
              >
                👤 Make User
              </button>
              <button
                onClick={() => handleBulkAction('makeAdmin')}
                className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
              >
                👑 Make Admin
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">
              {filters.search || filters.role || filters.status 
                ? 'Try adjusting your filters'
                : 'No users have registered yet'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    isSelected={selectedUsers.includes(user.id)}
                    isCurrentUser={user.id === currentUserProfile?.id}
                    onSelect={() => handleSelectUser(user.id)}
                    onUpdateRole={handleUpdateUserRole}
                    onToggleStatus={handleToggleUserStatus}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 User Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'admin' || u.role === 'owner').length}
            </div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => !u.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Inactive Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {users.length}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserRow = ({ user, isSelected, isCurrentUser, onSelect, onUpdateRole, onToggleStatus }) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <tr className={`hover:bg-gray-50 ${isCurrentUser ? 'bg-yellow-50' : ''}`}>
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          disabled={isCurrentUser}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 flex items-center">
              {user.full_name || 'Unnamed User'}
              {isCurrentUser && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  You
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
            {user.phone && (
              <div className="text-sm text-gray-500">{user.phone}</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => !isCurrentUser && setShowRoleMenu(!showRoleMenu)}
            disabled={isCurrentUser}
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.role === 'admin' ? 'bg-red-100 text-red-800' :
              user.role === 'owner' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            } ${!isCurrentUser ? 'hover:opacity-80 cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
          >
            {user.role === 'admin' ? '👑 Admin' : 
             user.role === 'owner' ? '👑 Owner' : 
             '👤 User'}
          </button>
          
          {showRoleMenu && !isCurrentUser && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border">
              <div className="py-1">
                <button
                  onClick={() => {
                    onUpdateRole(user.id, 'user');
                    setShowRoleMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  👤 User
                </button>
                <button
                  onClick={() => {
                    onUpdateRole(user.id, 'admin');
                    setShowRoleMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  👑 Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => !isCurrentUser && onToggleStatus(user.id, user.is_active)}
          disabled={isCurrentUser}
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            user.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          } ${!isCurrentUser ? 'hover:opacity-80 cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
        >
          {user.is_active ? '✅ Active' : '❌ Inactive'}
        </button>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {formatDate(user.created_at)}
      </td>
      <td className="px-6 py-4 text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            disabled={isCurrentUser}
            className={`${!isCurrentUser ? 'text-indigo-600 hover:text-indigo-900' : 'text-gray-400 cursor-not-allowed'}`}
            title="Change Role"
          >
            ⚙️
          </button>
          <button
            onClick={() => onToggleStatus(user.id, user.is_active)}
            disabled={isCurrentUser}
            className={`${
              !isCurrentUser ? (
                user.is_active 
                  ? 'text-red-600 hover:text-red-900' 
                  : 'text-green-600 hover:text-green-900'
              ) : 'text-gray-400 cursor-not-allowed'
            }`}
            title={isCurrentUser ? 'Cannot modify own account' : (user.is_active ? 'Deactivate User' : 'Activate User')}
          >
            {user.is_active ? '⏸️' : '▶️'}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminUsers;