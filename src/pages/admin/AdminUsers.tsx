import React, { useState } from 'react';
import { Search, UserCheck, UserX, Mail, Calendar, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

interface User {
  id: string;
  email: string;
  status: 'active' | 'suspended' | 'banned';
  role: 'user' | 'admin';
  reports_count: number;
  created_at: string;
  last_login: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'admin@dintalk.com',
      status: 'active',
      role: 'admin',
      reports_count: 0,
      created_at: '2024-01-01T00:00:00Z',
      last_login: '2024-03-20T10:30:00Z'
    },
    {
      id: '2',
      email: 'user@demo.com',
      status: 'active',
      role: 'user',
      reports_count: 3,
      created_at: '2024-02-15T08:20:00Z',
      last_login: '2024-03-19T14:15:00Z'
    },
    {
      id: '3',
      email: 'john@example.com',
      status: 'active',
      role: 'user',
      reports_count: 1,
      created_at: '2024-03-01T12:00:00Z',
      last_login: '2024-03-18T09:45:00Z'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (userId: string, newStatus: 'active' | 'suspended' | 'banned') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleRoleChange = (userId: string, newRole: 'user' | 'admin') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reports
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.role === 'admin' && <Shield className="h-4 w-4 text-blue-600 mr-1" />}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.reports_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.last_login).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                      >
                        Manage
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Management Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        title="Manage User"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">User Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Status:</strong> {selectedUser.status}</p>
                <p><strong>Reports:</strong> {selectedUser.reports_count}</p>
                <p><strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Change Status</h4>
              <div className="flex space-x-2">
                <Button
                  variant={selectedUser.status === 'active' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange(selectedUser.id, 'active')}
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Active
                </Button>
                <Button
                  variant={selectedUser.status === 'suspended' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange(selectedUser.id, 'suspended')}
                >
                  Suspended
                </Button>
                <Button
                  variant={selectedUser.status === 'banned' ? 'danger' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange(selectedUser.id, 'banned')}
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Banned
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Change Role</h4>
              <div className="flex space-x-2">
                <Button
                  variant={selectedUser.role === 'user' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleRoleChange(selectedUser.id, 'user')}
                >
                  User
                </Button>
                <Button
                  variant={selectedUser.role === 'admin' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleRoleChange(selectedUser.id, 'admin')}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setSelectedUser(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}