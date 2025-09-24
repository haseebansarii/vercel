// Mock authentication system for demo purposes
export interface MockUser {
  id: string;
  email: string;
  created_at: string;
}

// Store users in localStorage for persistence
const STORAGE_KEY = 'mockUsers';

function getStoredUsers(): Record<string, { password: string; user: MockUser }> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load stored users:', error);
  }
  
  // Default users if nothing stored
  const defaultUsers = {
    'admin@dintalk.com': {
      password: 'admin123',
      user: {
        id: 'admin-user-id',
        email: 'admin@dintalk.com',
        created_at: new Date().toISOString(),
      }
    },
    'user@demo.com': {
      password: 'user123',
      user: {
        id: 'demo-user-id',
        email: 'user@demo.com',
        created_at: new Date().toISOString(),
      }
    }
  };
  
  // Store default users
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

function saveUsers(users: Record<string, { password: string; user: MockUser }>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.warn('Failed to save users:', error);
  }
}

class MockAuthService {
  private currentUser: MockUser | null = null;
  private listeners: ((user: MockUser | null) => void)[] = [];
  private users: Record<string, { password: string; user: MockUser }> = {};

  constructor() {
    this.users = getStoredUsers();
    // Check for stored session
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  getCurrentUser(): MockUser | null {
    return this.currentUser;
  }

  onAuthStateChange(callback: (user: MockUser | null) => void) {
    this.listeners.push(callback);
    // Call immediately with current state
    callback(this.currentUser);
    
    return {
      unsubscribe: () => {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
          this.listeners.splice(index, 1);
        }
      }
    };
  }

  async signUp(email: string, password: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (this.users[email]) {
      throw new Error('User already registered');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Create new user
    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      email,
      created_at: new Date().toISOString(),
    };

    this.users[email] = {
      password,
      user: newUser
    };

    // Save to localStorage
    saveUsers(this.users);

    this.setCurrentUser(newUser);
  }

  async signIn(email: string, password: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = this.users[email];
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    this.setCurrentUser(user.user);
  }

  async signOut(): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.setCurrentUser(null);
  }

  // Method to check if user exists (for debugging)
  getUserList(): string[] {
    return Object.keys(this.users);
  }

  private setCurrentUser(user: MockUser | null) {
    this.currentUser = user;
    
    if (user) {
      localStorage.setItem('mockUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('mockUser');
    }

    // Notify all listeners
    this.listeners.forEach(callback => callback(user));
  }
}

export const mockAuth = new MockAuthService();