import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Building, Calendar, Hash, IdCard, Trash2, Eye, EyeOff } from 'lucide-react';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'staff' | 'admin' | 'transport';
  department?: string;
  year?: string;
  rollNumber?: string;
  employeeId?: string;
  password: string;
}

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Load users from localStorage
    const loadUsers = () => {
      const storedUsers = localStorage.getItem('campus_portal_users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    };

    loadUsers();
    
    // Refresh users every second to show real-time updates
    const interval = setInterval(loadUsers, 1000);
    return () => clearInterval(interval);
  }, []);

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('campus_portal_users', JSON.stringify(updatedUsers));
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'faculty': return 'bg-purple-100 text-purple-800';
      case 'staff': return 'bg-green-100 text-green-800';
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'transport': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'faculty': return User;
      case 'staff': return Building;
      case 'student': return User;
      case 'transport': return User;
      default: return User;
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
          <p className="text-red-600">You need admin privileges to access user management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage all registered users in the system</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Registered Users ({users.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((userData) => {
                const RoleIcon = getRoleIcon(userData.role);
                return (
                  <tr key={userData.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userData.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {userData.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(userData.role)}`}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {userData.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {userData.department || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userData.role === 'student' ? (
                        <div>
                          {userData.year && (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {userData.year}
                            </div>
                          )}
                          {userData.rollNumber && (
                            <div className="flex items-center">
                              <Hash className="h-3 w-3 mr-1" />
                              {userData.rollNumber}
                            </div>
                          )}
                        </div>
                      ) : (
                        userData.employeeId && (
                          <div className="flex items-center">
                            <IdCard className="h-3 w-3 mr-1" />
                            {userData.employeeId}
                          </div>
                        )
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">
                          {showPasswords[userData.id] ? userData.password : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(userData.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords[userData.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteUser(userData.id)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                        disabled={userData.id === user?.id}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No users have been registered yet.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800">How to test the authentication system:</h3>
        <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>Create a new account using the registration form</li>
          <li>Log out and log back in with the new credentials</li>
          <li>Refresh the page - your session should persist</li>
          <li>Close the browser and reopen - you should still be logged in</li>
          <li>All user data is stored in localStorage and persists across sessions</li>
        </ul>
      </div>
    </div>
  );
};

export default UserManagement;
