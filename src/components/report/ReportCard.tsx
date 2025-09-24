import React from 'react';
import { ThumbsUp, ThumbsDown, Calendar, MapPin, Eye } from 'lucide-react';
import { Report } from '../../types';
import { formatRelativeTime } from '../../lib/utils';

interface ReportCardProps {
  report: Report;
  showEntity?: boolean;
  onViewDetails?: (report: Report) => void;
}

export function ReportCard({ report, showEntity = true, onViewDetails }: ReportCardProps) {
  const isPositive = report.type === 'positive';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isPositive ? (
              <ThumbsUp className="h-5 w-5" />
            ) : (
              <ThumbsDown className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{report.title}</h3>
            {showEntity && report.entity && (
              <p className="text-sm text-gray-600">
                {report.entity.name} • {report.entity.type}
              </p>
            )}
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          isPositive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {report.category}
        </span>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {report.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatRelativeTime(report.created_at)}</span>
          </div>
          {report.entity?.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{report.entity.location}</span>
            </div>
          )}
        </div>
        
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(report)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </button>
        )}
      </div>

      {report.replies && report.replies.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{report.replies.length}</span> 
            {report.replies.length === 1 ? ' reply' : ' replies'} from the entity
          </p>
        </div>
      )}
    </div>
  );
}