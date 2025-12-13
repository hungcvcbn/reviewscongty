import { User, UserRole } from './types';
import usersData from './data/users.json';

// Simple authentication - in production, this would use proper auth service
export interface AuthUser extends User {
  password?: string; // Only for mock data
}

const users = usersData as AuthUser[];

// Mock passwords for demo (in production, use proper hashing)
const mockPasswords: Record<string, string> = {
  'admin@reviewcompany.com': 'admin123',
  'manager@reviewcompany.com': 'manager123',
  'user1@example.com': 'user123',
  'user2@example.com': 'user123',
  'user3@example.com': 'user123',
  'user4@example.com': 'user123',
  'user5@example.com': 'user123',
  'owner1@techcorp.vn': 'owner123',
  'owner2@softdev.vn': 'owner123',
  'owner3@fintech.vn': 'owner123',
};

export async function login(email: string, password: string): Promise<AuthUser | null> {
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  
  // In production, verify password hash
  const expectedPassword = mockPasswords[email];
  if (!expectedPassword || expectedPassword !== password) {
    return null;
  }
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as AuthUser;
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  const user = users.find((u) => u.id === id);
  if (!user) return null;
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as AuthUser;
}

export function hasRole(user: User | null, roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

export function isAdmin(user: User | null): boolean {
  return hasRole(user, ['ADMIN']);
}

export function isManager(user: User | null): boolean {
  return hasRole(user, ['ADMIN', 'MANAGER']);
}

export function isCompanyOwner(user: User | null): boolean {
  return hasRole(user, ['COMPANY_OWNER']);
}
