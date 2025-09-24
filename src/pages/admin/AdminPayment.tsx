import React, { useState } from 'react';
import { CreditCard, DollarSign, TrendingUp, Users, Settings, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

interface Transaction {
  id: string;
  user_email: string;
  amount: number;
  currency: string;
  type: 'subscription' | 'one-time' | 'refund';
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
  description: string;
}

export function AdminPayment() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      user_email: 'user@example.com',
      amount: 9.99,
      currency: 'USD',
      type: 'subscription',
      status: 'completed',
      created_at: '2024-03-20T10:30:00Z',
      description: 'Premium subscription - Monthly'
    },
    {
      id: '2',
      user_email: 'jane@example.com',
      amount: 4.99,
      currency: 'USD',
      type: 'one-time',
      status: 'completed',
      created_at: '2024-03-19T14:15:00Z',
      description: 'Priority report review'
    },
    {
      id: '3',
      user_email: 'mike@example.com',
      amount: 9.99,
      currency: 'USD',
      type: 'refund',
      status: 'completed',
      created_at: '2024-03-18T09:45:00Z',
      description: 'Subscription refund'
    }
  ]);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState({
    stripePublishableKey: '',
    stripeSecretKey: '',
    subscriptionPrice: '9.99',
    priorityReviewPrice: '4.99',
    currency: 'USD',
    enableSubscriptions: true,
    enableOneTimePayments: true
  });

  const totalRevenue = transactions
    .filter(t => t.status === 'completed' && t.type !== 'refund')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyRevenue = transactions
    .filter(t => {
      const transactionDate = new Date(t.created_at);
      const currentMonth = new Date().getMonth();
      return transactionDate.getMonth() === currentMonth && 
             t.status === 'completed' && 
             t.type !== 'refund';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const activeSubscriptions = transactions
    .filter(t => t.type === 'subscription' && t.status === 'completed')
    .length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'subscription': return 'bg-blue-100 text-blue-800';
      case 'one-time': return 'bg-purple-100 text-purple-800';
      case 'refund': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">Manage payments, subscriptions, and billing</p>
        </div>
        <Button onClick={() => setShowSettingsModal(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Payment Settings
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</p>
              <p className="text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">${monthlyRevenue.toFixed(2)}</p>
              <p className="text-gray-600">This Month</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{activeSubscriptions}</p>
              <p className="text-gray-600">Active Subscriptions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{transactions.length}</p>
              <p className="text-gray-600">Total Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.user_email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.type === 'refund' ? '-' : ''}${transaction.amount.toFixed(2)} {transaction.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Payment Settings"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Stripe Configuration</h4>
            <div className="space-y-4">
              <Input
                label="Stripe Publishable Key"
                value={paymentSettings.stripePublishableKey}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, stripePublishableKey: e.target.value }))}
                placeholder="pk_test_..."
              />
              <Input
                label="Stripe Secret Key"
                type="password"
                value={paymentSettings.stripeSecretKey}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, stripeSecretKey: e.target.value }))}
                placeholder="sk_test_..."
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Pricing</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Subscription Price"
                value={paymentSettings.subscriptionPrice}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, subscriptionPrice: e.target.value }))}
              />
              <Input
                label="Priority Review Price"
                value={paymentSettings.priorityReviewPrice}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, priorityReviewPrice: e.target.value }))}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={paymentSettings.currency}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, currency: e.target.value }))}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="GHS">GHS</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Features</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Enable Subscriptions</label>
                  <p className="text-sm text-gray-500">Allow users to subscribe for premium features</p>
                </div>
                <input
                  type="checkbox"
                  checked={paymentSettings.enableSubscriptions}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, enableSubscriptions: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Enable One-time Payments</label>
                  <p className="text-sm text-gray-500">Allow users to pay for individual services</p>
                </div>
                <input
                  type="checkbox"
                  checked={paymentSettings.enableOneTimePayments}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, enableOneTimePayments: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowSettingsModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowSettingsModal(false)}>
              Save Settings
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}