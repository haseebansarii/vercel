import React, { useEffect, useState } from 'react';
import { Plus, FileText, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthContext } from '../contexts/AuthContext';
import { Report } from '../types';
import { db } from '../lib/database';
import { Button } from '../components/ui/Button';
import { ReportCard } from '../components/report/ReportCard';

export function Dashboard() {
  const { user } = useAuthContext();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserReports();
  }, [user]);

  const fetchUserReports = async () => {
    if (!user) return;
    
    try {
      const data = await db.getReports({ reporter_id: user.id });
      setReports(data);
    } catch (error: any) {
      toast.error('Failed to fetch your reports');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    approved: reports.filter(r => r.status === 'approved').length,
    rejected: reports.filter(r => r.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
            <p className="text-gray-600 mt-1">
              Track and manage your submitted reports
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link to="/submit-report">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Submit New Report
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                <p className="text-gray-600">Total Reports</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                <p className="text-gray-600">Under Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
                <p className="text-gray-600">Approved</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
                <p className="text-gray-600">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        {reports.length > 0 ? (
          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report.id} className="relative">
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${
                  report.status === 'approved' ? 'bg-green-500' :
                  report.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <div className="pl-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'approved' ? 'bg-green-100 text-green-800' :
                      report.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                    {report.status === 'approved' && (
                      <Link 
                        to={`/entity/${report.entity_id}`}
                        className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Public</span>
                      </Link>
                    )}
                  </div>
                  <ReportCard report={report} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reports yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by submitting your first report about a company or individual.
            </p>
            <Link to="/submit-report">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Submit Your First Report
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}