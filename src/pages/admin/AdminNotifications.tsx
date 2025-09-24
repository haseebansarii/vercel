import React, { useState } from 'react';
import { Bell, Send, Users, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Modal } from '../../components/ui/Modal';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  recipients: 'all' | 'admins' | 'users';
  sent_at: string;
  read_count: number;
  total_recipients: number;
}

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Platform Maintenance Scheduled',
      message: 'We will be performing scheduled maintenance on March 25th from 2:00 AM to 4:00 AM GMT.',
      type: 'info',
      recipients: 'all',
      sent_at: '2024-03-20T10:00:00Z',
      read_count: 45,
      total_recipients: 100
    },
    {
      id: '2',
      title: 'New Community Guidelines',
      message: 'Please review our updated community guidelines to ensure your reports comply with our standards.',
      type: 'warning',
      recipients: 'users',
      sent_at: '2024-03-18T14:30:00Z',
      read_count: 32,
      total_recipients: 85
    }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    recipients: 'all' as 'all' | 'admins' | 'users'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...formData,
      sent_at: new Date().toISOString(),
      read_count: 0,
      total_recipients: formData.recipients === 'all' ? 100 : formData.recipients === 'users' ? 85 : 15
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setShowModal(false);
    setFormData({ title: '', message: '', type: 'info', recipients: 'all' });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Send notifications to users and manage communication</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Send className="h-4 w-4 mr-2" />
          Send Notification
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{notifications.length}</p>
              <p className="text-gray-600">Total Sent</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">100</p>
              <p className="text-gray-600">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round((notifications.reduce((acc, n) => acc + n.read_count, 0) / 
                notifications.reduce((acc, n) => acc + n.total_recipients, 0)) * 100) || 0}%
              </p>
              <p className="text-gray-600">Read Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Notifications</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getTypeIcon(notification.type)}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        To: {notification.recipients}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.sent_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {notification.read_count}/{notification.total_recipients}
                  </div>
                  <div className="text-xs text-gray-500">Read</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Send Notification Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setFormData({ title: '', message: '', type: 'info', recipients: 'all' });
        }}
        title="Send Notification"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          
          <TextArea
            label="Message"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            rows={4}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
            <select
              value={formData.recipients}
              onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value as any }))}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="users">Regular Users</option>
              <option value="admins">Admins Only</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setFormData({ title: '', message: '', type: 'info', recipients: 'all' });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}