// Mock data for demo purposes
import { Entity, Report } from '../types';

export const mockEntities: Entity[] = [
  {
    id: 'entity-1',
    name: 'Accra Mall',
    type: 'company',
    description: 'Premier shopping destination in Accra with various retail stores and restaurants.',
    location: 'Accra, Greater Accra',
    verified: true,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'entity-2',
    name: 'MTN Ghana',
    type: 'company',
    description: 'Leading telecommunications company providing mobile and internet services.',
    location: 'Nationwide',
    verified: true,
    created_at: '2024-01-10T08:30:00Z'
  },
  {
    id: 'entity-3',
    name: 'Kwame Asante',
    type: 'individual',
    description: 'Professional electrician providing residential and commercial electrical services.',
    location: 'Kumasi, Ashanti',
    verified: false,
    created_at: '2024-02-01T14:20:00Z'
  },
  {
    id: 'entity-4',
    name: 'Shoprite Ghana',
    type: 'company',
    description: 'South African retail chain with multiple locations across Ghana.',
    location: 'Multiple locations',
    verified: true,
    created_at: '2024-01-20T09:15:00Z'
  },
  {
    id: 'entity-5',
    name: 'Ama Serwaa',
    type: 'individual',
    description: 'Experienced seamstress specializing in traditional and modern clothing.',
    location: 'Tamale, Northern',
    verified: false,
    created_at: '2024-02-10T16:45:00Z'
  }
];

export const mockReports: Report[] = [
  {
    id: 'report-1',
    entity_id: 'entity-1',
    reporter_id: 'demo-user-id',
    type: 'positive',
    category: 'Excellent Service',
    title: 'Great shopping experience at Accra Mall',
    description: 'Had an amazing time shopping at Accra Mall. The staff were very helpful and the facilities were clean and well-maintained. Parking was easy to find and the security was excellent.',
    original_description: 'Had an amazing time shopping at Accra Mall. The staff were very helpful and the facilities were clean and well-maintained. Parking was easy to find and the security was excellent.',
    status: 'approved',
    is_anonymous: false,
    created_at: '2024-03-01T10:30:00Z',
    entity: mockEntities[0]
  },
  {
    id: 'report-2',
    entity_id: 'entity-2',
    reporter_id: 'john-user-id',
    type: 'negative',
    category: 'Poor Service',
    title: 'Network issues with MTN',
    description: 'Been experiencing frequent network outages in my area. Customer service was not very helpful when I called to complain. Hope they can improve their service quality.',
    original_description: 'Been experiencing frequent network outages in my area. Customer service was not very helpful when I called to complain. Hope they can improve their service quality.',
    status: 'approved',
    is_anonymous: false,
    created_at: '2024-03-05T14:15:00Z',
    entity: mockEntities[1]
  },
  {
    id: 'report-3',
    entity_id: 'entity-3',
    reporter_id: 'demo-user-id',
    type: 'positive',
    category: 'Professional Conduct',
    title: 'Excellent electrical work by Kwame',
    description: 'Kwame did an outstanding job rewiring my house. He was punctual, professional, and his work quality was excellent. Highly recommend his services to anyone needing electrical work.',
    original_description: 'Kwame did an outstanding job rewiring my house. He was punctual, professional, and his work quality was excellent. Highly recommend his services to anyone needing electrical work.',
    status: 'approved',
    is_anonymous: false,
    created_at: '2024-03-10T09:20:00Z',
    entity: mockEntities[2]
  },
  {
    id: 'report-4',
    entity_id: 'entity-1',
    reporter_id: 'john-user-id',
    type: 'negative',
    category: 'Poor Service',
    title: 'Long waiting times at Accra Mall',
    description: 'Had to wait over 30 minutes just to get assistance at one of the stores. The customer service could be much better.',
    original_description: 'Had to wait over 30 minutes just to get assistance at one of the stores. The customer service could be much better.',
    status: 'pending',
    is_anonymous: false,
    created_at: '2024-03-15T11:45:00Z',
    entity: mockEntities[0]
  },
  {
    id: 'report-5',
    entity_id: 'entity-2',
    reporter_id: 'demo-user-id',
    type: 'positive',
    category: 'Excellent Service',
    title: 'Great MTN customer support',
    description: 'Called MTN customer service and they resolved my billing issue quickly and professionally. Very satisfied with the service.',
    original_description: 'Called MTN customer service and they resolved my billing issue quickly and professionally. Very satisfied with the service.',
    status: 'pending',
    is_anonymous: true,
    created_at: '2024-03-16T14:20:00Z',
    entity: mockEntities[1]
  }
];

// Mock database service
class MockDatabase {
  private entities: Entity[] = [...mockEntities];
  private reports: Report[] = [...mockReports];

  // Entities
  async getEntities(): Promise<Entity[]> {
    await this.delay();
    return [...this.entities];
  }

  async getEntity(id: string): Promise<Entity | null> {
    await this.delay();
    return this.entities.find(e => e.id === id) || null;
  }

  async createEntity(entity: Omit<Entity, 'id' | 'created_at'>): Promise<Entity> {
    await this.delay();
    const newEntity: Entity = {
      ...entity,
      id: `entity-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.entities.push(newEntity);
    return newEntity;
  }

  // Reports
  async getReports(filters?: { entity_id?: string; status?: string; reporter_id?: string }): Promise<Report[]> {
    await this.delay();
    let filtered = [...this.reports];
    
    if (filters?.entity_id) {
      filtered = filtered.filter(r => r.entity_id === filters.entity_id);
    }
    if (filters?.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters?.reporter_id) {
      filtered = filtered.filter(r => r.reporter_id === filters.reporter_id);
    }

    // Add entity data
    return filtered.map(report => ({
      ...report,
      entity: this.entities.find(e => e.id === report.entity_id)
    }));
  }

  async createReport(report: Omit<Report, 'id' | 'created_at' | 'status'>): Promise<Report> {
    await this.delay();
    const newReport: Report = {
      ...report,
      id: `report-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    this.reports.push(newReport);
    return newReport;
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<Report | null> {
    await this.delay();
    const index = this.reports.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    this.reports[index] = { ...this.reports[index], ...updates };
    return this.reports[index];
  }

  // Get report stats for entities
  async getReportStats(): Promise<Record<string, { positive: number; negative: number }>> {
    await this.delay();
    const stats: Record<string, { positive: number; negative: number }> = {};
    
    this.reports
      .filter(r => r.status === 'approved')
      .forEach(report => {
        if (!stats[report.entity_id]) {
          stats[report.entity_id] = { positive: 0, negative: 0 };
        }
        stats[report.entity_id][report.type]++;
      });
    
    return stats;
  }

  async approveAllReports(): Promise<void> {
    await this.delay();
    this.reports = this.reports.map(report => ({
      ...report,
      status: report.status === 'pending' ? 'approved' : report.status
    }));
  }

  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockDb = new MockDatabase();