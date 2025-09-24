export interface Entity {
  id: string;
  name: string;
  type: 'company' | 'individual';
  description?: string;
  location?: string;
  verified: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  entity_id: string;
  reporter_id: string;
  type: 'positive' | 'negative';
  category: string;
  title: string;
  description: string;
  original_description: string;
  status: 'pending' | 'approved' | 'rejected';
  is_anonymous: boolean;
  created_at: string;
  entity?: Entity;
  evidence?: Evidence[];
  replies?: Reply[];
}

export interface Evidence {
  id: string;
  report_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  created_at: string;
}

export interface Reply {
  id: string;
  report_id: string;
  entity_id: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  entity?: Entity;
  report?: Report;
}

export interface Moderation {
  id: string;
  report_id: string;
  moderator_id: string;
  action: 'approve' | 'reject' | 'flag';
  notes?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}