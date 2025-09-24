import React, { useState, useEffect } from 'react';
import { Shield, Eye, Check, X, Flag, Clock, FileText, Users, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../contexts/AuthContext';
import { Report, Reply, Moderation, Entity } from '../types';
import { db } from '../lib/database';
import { Button } from '../components/ui/Button';
import { TextArea } from '../components/ui/TextArea';
import { Modal } from '../components/ui/Modal';
import { formatRelativeTime } from '../lib/utils';

export function Admin() {
  const { user, isAdmin } = useAuthContext();
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [pendingReplies, setPendingReplies] = useState<Reply[]>([]);
  const [selectedItem, setSelectedItem] = useState<Report | Reply | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    totalEntities: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      console.log('Fetching admin data...');
      
      const [reportsData, repliesData, stats] = await Promise.all([
        db.getPendingReports(),
        db.getPendingReplies(),
        db.getAdminStats()
      ]);

      console.log('Pending reports:', reportsData);
      console.log('Pending replies:', repliesData);
      console.log('Admin stats:', stats);

      setPendingReports(reportsData);
      setPendingReplies(repliesData);
      setStats(stats);
    } catch (error: any) {
      toast.error('Failed to fetch admin data');
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerateReport = async (reportId: string, action: 'approve' | 'reject') => {
    if (!user) return;

    try {
      setActionLoading(true);

      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      const moderation: Moderation = {
        id: `mod-${Date.now()}`,
        report_id: reportId,
        moderator_id: user.id,
        action: action,
        notes: moderationNotes,
        created_at: new Date().toISOString()
      };

      await db.updateReport(reportId, { status: newStatus });

      toast.success(`Report ${action}d successfully`);
      setSelectedItem(null);
      setModerationNotes('');
      fetchData(); // Refresh data after moderation
    } catch (error: any) {
      toast.error(`Failed to ${action} report`);
      console.error('Error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleModerateReply = async (replyId: string, action: 'approve' | 'reject') => {
    try {
      setActionLoading(true);

      await db.updateReply(replyId, { 
        status: action === 'approve' ? 'approved' : 'rejected' 
      });

      toast.success(`Reply ${action}d successfully`);
      setSelectedItem(null);
      fetchData();
    } catch (error: any) {
      toast.error(`Failed to ${action} reply`);
      console.error('Error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">
            Moderate reports and replies to maintain platform quality.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.totalReports}</p>
                <p className="text-gray-600">Total Reports</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingReports}</p>
                <p className="text-gray-600">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.totalEntities}</p>
                <p className="text-gray-600">Total Entities</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Pending Reports ({pendingReports.length})
          </h2>
          
          {pendingReports.length > 0 && (
            <div className="mb-4 flex justify-end">
              <Button
                onClick={async () => {
                  try {
                    setActionLoading(true);
                    await db.approveAllReports();
                    toast.success(`Approved ${pendingReports.length} reports successfully!`);
                    fetchData();
                  } catch (error) {
                    toast.error('Failed to approve all reports');
                  } finally {
                    setActionLoading(false);
                  }
                }}
                loading={actionLoading}
                disabled={pendingReports.length === 0}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve All ({pendingReports.length})
              </Button>
            </div>
          )}
          
          {pendingReports.length > 0 ? (
            <div className="space-y-4">
              {pendingReports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {report.entity?.name} • {report.type} • {report.category}
                      </p>
                      <p className="text-sm text-gray-500">
                        Submitted {formatRelativeTime(report.created_at)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.type === 'positive' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {report.category}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{report.description}</p>

                  {report.evidence && report.evidence.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Evidence ({report.evidence.length} files)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {report.evidence.map((evidence) => (
                          <a
                            key={evidence.id}
                            href={evidence.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded transition-colors"
                          >
                            {evidence.file_type.startsWith('image/') ? (
                              <img 
                                src={evidence.file_path} 
                                alt={evidence.file_name}
                                className="w-4 h-4 object-cover rounded mr-1"
                              />
                            ) : (
                              <FileText className="w-4 h-4 mr-1" />
                            )}
                            {evidence.file_name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedItem(report)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleModerateReport(report.id, 'approve')}
                      loading={actionLoading}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Quick Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleModerateReport(report.id, 'reject')}
                      loading={actionLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Quick Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No pending reports</p>
            </div>
          )}
        </div>

        {/* Pending Replies */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Pending Replies ({pendingReplies.length})
          </h2>
          
          {pendingReplies.length > 0 ? (
            <div className="space-y-4">
              {pendingReplies.map((reply) => (
                <div key={reply.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Reply from {reply.entity?.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        In response to: {reply.report?.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Submitted {formatRelativeTime(reply.created_at)}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{reply.content}</p>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleModerateReply(reply.id, 'approve')}
                      loading={actionLoading}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleModerateReply(reply.id, 'reject')}
                      loading={actionLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No pending replies</p>
            </div>
          )}
        </div>

        {/* Moderation Modal */}
        <Modal
          isOpen={!!selectedItem && 'reporter_id' in selectedItem}
          onClose={() => {
            setSelectedItem(null);
            setModerationNotes('');
          }}
          title="Review Report"
          size="lg"
        >
          {selectedItem && 'reporter_id' in selectedItem && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{selectedItem.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedItem.entity?.name} • {selectedItem.type} • {selectedItem.category}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Submitted by: {selectedItem.is_anonymous ? 'Anonymous User' : 'Registered User'} • {formatRelativeTime(selectedItem.created_at)}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedItem.description}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Original Description</h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedItem.original_description}</p>
                </div>
              </div>

              {selectedItem.evidence && selectedItem.evidence.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Evidence Files</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      {selectedItem.evidence.map((evidence) => (
                        <div key={evidence.id} className="relative group">
                          {evidence.file_type.startsWith('image/') ? (
                            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={evidence.file_path}
                                alt={evidence.file_name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="relative aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                            <a
                              href={evidence.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                            >
                              View File
                            </a>
                          </div>
                          <p className="mt-1 text-xs text-gray-600 truncate">
                            {evidence.file_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <TextArea
                label="Moderation Notes (Optional)"
                placeholder="Add notes about your decision..."
                rows={3}
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedItem(null);
                    setModerationNotes('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleModerateReport(selectedItem.id, 'reject')}
                  loading={actionLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleModerateReport(selectedItem.id, 'approve')}
                  loading={actionLoading}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}