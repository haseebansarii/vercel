import { supabase } from './supabase';
import { Entity, Report, Reply, Evidence } from '../types';
import { mockDb } from './mockData';

export class DatabaseService {
  private isSupabaseConnected(): boolean {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder');
  }

  // Entities
  async getEntities(): Promise<Entity[]> {
    if (this.isSupabaseConnected()) {
      try {
        const { data, error } = await supabase
          .from('entities')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('Supabase error, falling back to mock data:', error);
        return mockDb.getEntities();
      }
    } else {
      return mockDb.getEntities();
    }
  }

  async getEntity(id: string): Promise<Entity | null> {
    if (this.isSupabaseConnected()) {
      try {
        const { data, error } = await supabase
          .from('entities')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null; // Not found
          throw error;
        }
        return data;
      } catch (error) {
        console.warn('Supabase error, falling back to mock data:', error);
        return mockDb.getEntity(id);
      }
    } else {
      return mockDb.getEntity(id);
    }
  }

  async createEntity(entity: Omit<Entity, 'id' | 'created_at' | 'verified'>): Promise<Entity> {
    if (this.isSupabaseConnected()) {
      try {
        const { data, error } = await supabase
          .from('entities')
          .insert([{
            ...entity,
            verified: false
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Supabase error, falling back to mock data:', error);
        return mockDb.createEntity(entity);
      }
    } else {
      return mockDb.createEntity(entity);
    }
  }

  // Reports
  async getReports(filters?: { 
    entity_id?: string; 
    status?: string; 
    reporter_id?: string;
    type?: string;
  }): Promise<Report[]> {
    if (this.isSupabaseConnected()) {
      try {
        let query = supabase
          .from('reports')
          .select(`
            *,
            entity:entities(*),
            evidence(*),
            replies(
              *,
              entity:entities(*)
            )
          `)
          .order('created_at', { ascending: false });

        if (filters?.entity_id) {
          query = query.eq('entity_id', filters.entity_id);
        }
        if (filters?.status) {
          query = query.eq('status', filters.status);
        }
        if (filters?.reporter_id) {
          query = query.eq('reporter_id', filters.reporter_id);
        }
        if (filters?.type) {
          query = query.eq('type', filters.type);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('Supabase error, falling back to mock data:', error);
        return mockDb.getReports(filters);
      }
    } else {
      return mockDb.getReports(filters);
    }
  }

  async createReport(report: Omit<Report, 'id' | 'created_at' | 'status'>): Promise<Report> {
    if (this.isSupabaseConnected()) {
      try {
        // Ensure we have a valid reporter_id from the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('You must be logged in to submit a report');
        }
        
        const { data, error } = await supabase
          .from('reports')
          .insert([{
            ...report,
            reporter_id: user.id, // Use the actual Supabase user ID
            status: 'pending'
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Supabase error, falling back to mock data:', error);
        return mockDb.createReport(report);
      }
    } else {
      return mockDb.createReport(report);
    }
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<Report | null> {
    if (this.isSupabaseConnected()) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null; // Not found
          throw error;
        }
        return data;
      } catch (error) {
        console.warn('Supabase error, falling back to mock data:', error);
        return mockDb.updateReport(id, updates);
      }
    } else {
      return mockDb.updateReport(id, updates);
    }
  }

  // Replies
  async createReply(reply: Omit<Reply, 'id' | 'created_at' | 'status'>): Promise<Reply> {
    if (this.isSupabaseConnected()) {
      try {
        const { data, error } = await supabase
          .from('replies')
          .insert([{
            ...reply,
            status: 'pending'
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Supabase error, using mock functionality');
        // Mock reply creation
        return {
          id: `reply-${Date.now()}`,
          ...reply,
          status: 'pending' as const,
          created_at: new Date().toISOString()
        };
      }
    } else {
      // Mock reply creation
      return {
        id: `reply-${Date.now()}`,
        ...reply,
        status: 'pending' as const,
        created_at: new Date().toISOString()
      };
    }
  }

  async updateReply(id: string, updates: Partial<Reply>): Promise<Reply | null> {
    if (this.isSupabaseConnected()) {
      try {
        const { data, error } = await supabase
          .from('replies')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null; // Not found
          throw error;
        }
        return data;
      } catch (error) {
        console.warn('Supabase error, using mock functionality');
        return null;
      }
    } else {
      return null;
    }
  }

  // Evidence
  private async uploadFile(file: File, reportId: string): Promise<string> {
    if (this.isSupabaseConnected()) {
      try {
        // Sanitize the original filename
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileExt = sanitizedName.split('.').pop();
        // Create a unique filename with reportId as the folder
        const fileName = `${reportId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from('evidence')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('evidence')
          .getPublicUrl(fileName);

        return publicUrl;
      } catch (error) {
        console.warn('Supabase storage error:', error);
        throw new Error('Failed to upload file to storage');
      }
    } else {
      return `mock-storage/${file.name}`;
    }
  }

  async uploadEvidence(files: File[], reportId: string): Promise<Evidence[]> {
    const evidenceEntries: Evidence[] = [];

    for (const file of files) {
      try {
        // 1. Upload file to storage
        const filePath = await this.uploadFile(file, reportId);

        // 2. Create evidence record
        const evidence: Omit<Evidence, 'id' | 'created_at'> = {
          report_id: reportId,
          file_path: filePath,
          file_name: file.name,
          file_type: file.type
        };

        const { data, error } = this.isSupabaseConnected()
          ? await supabase
              .from('evidence')
              .insert([evidence])
              .select()
              .single()
          : { 
              data: {
                id: `evidence-${Date.now()}`,
                ...evidence,
                created_at: new Date().toISOString()
              },
              error: null 
            };

        if (error) throw error;
        evidenceEntries.push(data);
      } catch (error) {
        console.error('Error uploading evidence:', error);
        throw error;
      }
    }

    return evidenceEntries;
  }

  // Stats
  async getReportStats(): Promise<Record<string, { positive: number; negative: number }>> {
    if (this.isSupabaseConnected()) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('entity_id, type')
          .eq('status', 'approved');

        if (error) throw error;

        const stats: Record<string, { positive: number; negative: number }> = {};
        
        (data || []).forEach(report => {
          if (!stats[report.entity_id]) {
            stats[report.entity_id] = { positive: 0, negative: 0 };
          }
          stats[report.entity_id][report.type as 'positive' | 'negative']++;
        });

        return stats;
      } catch (error) {
        console.warn('Supabase error, falling back to mock data:', error);
        return mockDb.getReportStats();
      }
    } else {
      return mockDb.getReportStats();
    }
  }

  // Admin functions
  async getAllReports(): Promise<Report[]> {
    return this.getReports();
  }

  async getPendingReports(): Promise<Report[]> {
    if (this.isSupabaseConnected()) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select(`
            *,
            entity:entities(*),
            evidence(*),
            replies(*)
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (error) throw error;
        console.log('Fetched pending reports:', data);
        return data || [];
      } catch (error) {
        console.error('Error fetching pending reports:', error);
        return [];
      }
    } else {
      const mockReports = await mockDb.getReports({ status: 'pending' });
      console.log('Using mock pending reports:', mockReports);
      return mockReports;
    }
  }

  async getPendingReplies(): Promise<Reply[]> {
    if (this.isSupabaseConnected()) {
      try {
        const { data, error } = await supabase
          .from('replies')
          .select(`
            *,
            entity:entities(*),
            report:reports(*)
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('Supabase error, returning empty array');
        return [];
      }
    } else {
      return [];
    }
  }

  async approveAllReports(): Promise<void> {
    if (this.isSupabaseConnected()) {
      try {
        const { error } = await supabase
          .from('reports')
          .update({ status: 'approved' })
          .eq('status', 'pending');

        if (error) throw error;
      } catch (error) {
        console.warn('Supabase error, using mock functionality');
        await mockDb.approveAllReports();
      }
    } else {
      await mockDb.approveAllReports();
    }
  }

  // Get counts for admin dashboard
  async getAdminStats(): Promise<{
    totalReports: number;
    pendingReports: number;
    totalEntities: number;
    totalUsers: number;
  }> {
    if (this.isSupabaseConnected()) {
      try {
        const [reportsResult, pendingResult, entitiesResult, usersResult] = await Promise.all([
          supabase.from('reports').select('id', { count: 'exact', head: true }),
          supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('entities').select('id', { count: 'exact', head: true }),
          supabase.from('users').select('id', { count: 'exact', head: true })
        ]);

        return {
          totalReports: reportsResult.count || 0,
          pendingReports: pendingResult.count || 0,
          totalEntities: entitiesResult.count || 0,
          totalUsers: usersResult.count || 0,
        };
      } catch (error) {
        console.warn('Supabase error, using mock stats');
        return {
          totalReports: 5,
          pendingReports: 2,
          totalEntities: 5,
          totalUsers: 3,
        };
      }
    } else {
      return {
        totalReports: 5,
        pendingReports: 2,
        totalEntities: 5,
        totalUsers: 3,
      };
    }
  }
}

export const db = new DatabaseService();