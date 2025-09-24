import React from 'react';
import { Building2, User, MapPin, CheckCircle } from 'lucide-react';
import { Entity } from '../../types';

interface EntityCardProps {
  entity: Entity;
  reportStats?: {
    positive: number;
    negative: number;
  };
  onClick?: (entity: Entity) => void;
}

export function EntityCard({ entity, reportStats, onClick }: EntityCardProps) {
  const totalReports = reportStats ? reportStats.positive + reportStats.negative : 0;
  const positivePercentage = totalReports > 0 ? (reportStats!.positive / totalReports) * 100 : 0;

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick?.(entity)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
            {entity.type === 'company' ? (
              <Building2 className="h-6 w-6" />
            ) : (
              <User className="h-6 w-6" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{entity.name}</h3>
              {entity.verified && (
                <CheckCircle className="h-5 w-5 text-blue-600" title="Verified Entity" />
              )}
            </div>
            <p className="text-sm text-gray-600 capitalize">{entity.type}</p>
          </div>
        </div>
      </div>

      {entity.description && (
        <p className="text-gray-700 mb-4 line-clamp-2">
          {entity.description}
        </p>
      )}

      {entity.location && (
        <div className="flex items-center space-x-1 mb-4 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{entity.location}</span>
        </div>
      )}

      {reportStats && totalReports > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Trust Score</span>
            <span className={`font-medium ${
              positivePercentage >= 70 ? 'text-green-600' :
              positivePercentage >= 40 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {Math.round(positivePercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                positivePercentage >= 70 ? 'bg-green-500' :
                positivePercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${positivePercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{reportStats.positive} positive</span>
            <span>{reportStats.negative} negative</span>
          </div>
        </div>
      )}
    </div>
  );
}