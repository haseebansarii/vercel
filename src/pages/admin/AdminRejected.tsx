import React, { useState, useEffect } from 'react';
import { XCircle, Eye, Search, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { db } from '../../lib/database';
import { Report } from '../../types';
import { formatRelativeTime } from '../../lib/utils';
import toast from 'react-hot-toast';

export function AdminRejected() {
  const [rejectedReports, setRejectedReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRejectedReports();
  }, []);

  const fetchRejectedReports = async () => {
    try {
      const data = await db.getReports({ status: 'rejected' });
      setRejectedReports(data);
    } catch (error) {
      console.error('Failed to fetch rejected reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = rejectedReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.entity?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleRestore = async (reportId: string) => {
    try {
      await db.updateReport(reportId, { status: 'pending' });
      setRejectedReports(prev => prev.filter(report => report.id !== reportId));
      toast.success('Report restored to pending status');
    } catch (error) {
      toast.error('Failed to restore report');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rejected Reports</h1>
          <p className="text-gray-600">View and manage all rejected reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <XCircle className="h-5 w-5 text-red-600" />
          <span className="text-sm font-medium text-red-600">
            {rejectedReports.length} Rejected
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search rejected reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{rejectedReports.length}</p>
              <p className="text-gray-600">Total Rejected</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">+</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {rejectedReports.filter(r => r.type === 'positive').length}
              </p>
              <p className="text-gray-600">Positive Reports</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">-</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {rejectedReports.filter(r => r.type === 'negative').length}
              </p>
              <p className="text-gray-600">Negative Reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rejected
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{report.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {report.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{report.entity?.name}</div>
                    <div className="text-sm text-gray-500">{report.entity?.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.type === 'positive' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatRelativeTime(report.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report);
                          setShowModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRestore(report.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No rejected reports found
          </h3>
          <p className="text-gray-600">
            {searchTerm || typeFilter !== 'all' 
              ? 'Try adjusting your search criteria.' 
              : 'No reports have been rejected yet.'}
          </p>
        </div>
      )}

      {/* View Report Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedReport(null);
        }}
        title="Rejected Report Details"
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{selectedReport.title}</h3>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Rejected
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Entity:</span>
                <p>{selectedReport.entity?.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Type:</span>
                <p className="capitalize">{selectedReport.type}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Category:</span>
                <p>{selectedReport.category}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Submitted:</span>
                <p>{formatRelativeTime(selectedReport.created_at)}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedReport.description}</p>
              </div>
            </div>

            {selectedReport.original_description !== selectedReport.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Original Description</h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedReport.original_description}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  handleRestore(selectedReport.id);
                  setShowModal(false);
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore to Pending
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setSelectedReport(null);
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