import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, User, MapPin, CheckCircle, ThumbsUp, ThumbsDown, MessageSquare, Calendar, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Entity, Report, Reply } from '../types';
import { db } from '../lib/database';
import { formatRelativeTime } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { ReportCard } from '../components/report/ReportCard';
import { Modal } from '../components/ui/Modal';
import { TextArea } from '../components/ui/TextArea';
import { useAuthContext } from '../contexts/AuthContext';

export function EntityProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const [entity, setEntity] = useState<Entity | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEntityData();
    }
  }, [id]);

  const fetchEntityData = async () => {
    if (!id) return;

    try {
      const [entityData, reportsData] = await Promise.all([
        db.getEntity(id),
        db.getReports({ entity_id: id, status: 'approved' })
      ]);

      setEntity(entityData);
      setReports(reportsData);
    } catch (error: any) {
      toast.error('Failed to fetch entity data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!selectedReport || !replyContent.trim() || !entity) return;

    try {
      setSubmittingReply(true);

      await db.createReply({
        report_id: selectedReport.id,
        entity_id: entity.id,
        content: replyContent.trim(),
      });

      toast.success('Reply submitted successfully! It will be reviewed before publication.');
      setShowReplyModal(false);
      setReplyContent('');
      setSelectedReport(null);
      
      // Refresh the entity data to show the new reply
      await fetchEntityData();
    } catch (error: any) {
      toast.error('Failed to submit reply');
      console.error('Error:', error);
    } finally {
      setSubmittingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Entity Not Found</h2>
          <p className="text-gray-600 mb-4">The entity you're looking for doesn't exist.</p>
          <Link to="/browse">
            <Button>Browse Entities</Button>
          </Link>
        </div>
      </div>
    );
  }

  const positiveReports = reports.filter(r => r.type === 'positive');
  const negativeReports = reports.filter(r => r.type === 'negative');
  const totalReports = reports.length;
  const trustScore = totalReports > 0 ? Math.round((positiveReports.length / totalReports) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/browse" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
        </div>

        {/* Entity Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-lg bg-blue-100 text-blue-700">
                {entity.type === 'company' ? (
                  <Building2 className="h-8 w-8" />
                ) : (
                  <User className="h-8 w-8" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{entity.name}</h1>
                  {entity.verified && (
                    <CheckCircle className="h-6 w-6 text-blue-600" title="Verified Entity" />
                  )}
                </div>
                <p className="text-lg text-gray-600 capitalize mb-2">{entity.type}</p>
                {entity.location && (
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{entity.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Score */}
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                trustScore >= 70 ? 'text-green-600' :
                trustScore >= 40 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {trustScore}%
              </div>
              <p className="text-gray-600">Trust Score</p>
              <p className="text-sm text-gray-500">
                Based on {totalReports} report{totalReports !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {entity.description && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-700">{entity.description}</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <ThumbsUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{positiveReports.length}</p>
                <p className="text-gray-600">Positive Reports</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <ThumbsDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{negativeReports.length}</p>
                <p className="text-gray-600">Negative Reports</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {reports.reduce((acc, r) => acc + (r.replies?.length || 0), 0)}
                </p>
                <p className="text-gray-600">Entity Replies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports */}
        {reports.length > 0 ? (
          <div className="space-y-8">
            {/* Positive Reports */}
            {positiveReports.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <ThumbsUp className="h-6 w-6 text-green-600 mr-2" />
                  Positive Experiences ({positiveReports.length})
                </h2>
                <div className="space-y-6">
                  {positiveReports.map((report) => (
                    <div key={report.id} className="space-y-4">
                      <ReportCard 
                        report={report} 
                        showEntity={false}
                        onViewDetails={setSelectedReport}
                      />
                      
                      {/* Entity Replies */}
                      {report.replies && report.replies.length > 0 && (
                        <div className="ml-8 space-y-3">
                          {report.replies.map((reply) => (
                            <div key={reply.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Building2 className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-blue-900">Entity Response</span>
                                <span className="text-sm text-blue-600">
                                  {formatRelativeTime(reply.created_at)}
                                </span>
                              </div>
                              <p className="text-blue-800">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Button */}
                      {user && (
                        <div className="ml-8">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              setShowReplyModal(true);
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Reply as Entity
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Negative Reports */}
            {negativeReports.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <ThumbsDown className="h-6 w-6 text-red-600 mr-2" />
                  Negative Experiences ({negativeReports.length})
                </h2>
                <div className="space-y-6">
                  {negativeReports.map((report) => (
                    <div key={report.id} className="space-y-4">
                      <ReportCard 
                        report={report} 
                        showEntity={false}
                        onViewDetails={setSelectedReport}
                      />
                      
                      {/* Entity Replies */}
                      {report.replies && report.replies.length > 0 && (
                        <div className="ml-8 space-y-3">
                          {report.replies.map((reply) => (
                            <div key={reply.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Building2 className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-blue-900">Entity Response</span>
                                <span className="text-sm text-blue-600">
                                  {formatRelativeTime(reply.created_at)}
                                </span>
                              </div>
                              <p className="text-blue-800">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Button */}
                      {user && (
                        <div className="ml-8">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              setShowReplyModal(true);
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Reply as Entity
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reports yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to share your experience with {entity.name}.
            </p>
            <Link to="/submit-report">
              <Button>Submit a Report</Button>
            </Link>
          </div>
        )}

        {/* Reply Modal */}
        <Modal
          isOpen={showReplyModal}
          onClose={() => {
            setShowReplyModal(false);
            setReplyContent('');
            setSelectedReport(null);
          }}
          title="Reply to Report"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Responding as the entity to provide your perspective on this report.
            </p>
            
            <TextArea
              label="Your Response"
              placeholder="Provide your response to this report..."
              rows={4}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyContent('');
                  setSelectedReport(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReply}
                loading={submittingReply}
                disabled={!replyContent.trim()}
              >
                Submit Reply
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}