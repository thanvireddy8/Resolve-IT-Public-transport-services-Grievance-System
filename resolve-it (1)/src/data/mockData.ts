import { Complaint, User } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'user@example.com', role: 'user' },
  { id: '2', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
];

export const mockComplaints: Complaint[] = [
  {
    id: 'CMP001',
    userId: '1',
    userName: 'John Doe',
    category: 'Bus Service',
    subject: 'Delayed Bus Route 42',
    description: 'The bus was delayed by 45 minutes without any prior notification.',
    status: 'Pending',
    date: '2024-03-10',
  },
  {
    id: 'CMP002',
    userId: '3',
    userName: 'Jane Smith',
    category: 'Infrastructure',
    subject: 'Broken Seat in Metro Train',
    description: 'Seat number 12 in coach B of the Blue Line metro is broken.',
    status: 'In Progress',
    date: '2024-03-09',
  },
  {
    id: 'CMP003',
    userId: '1',
    userName: 'John Doe',
    category: 'Staff Behavior',
    subject: 'Rude conductor',
    description: 'The conductor on bus 102 was very rude when I asked for change.',
    status: 'Resolved',
    date: '2024-03-08',
  },
  {
    id: 'CMP004',
    userId: '3',
    userName: 'Jane Smith',
    category: 'Cleanliness',
    subject: 'Litter at Station platform',
    description: 'Platform 3 of the central station is covered in trash.',
    status: 'Pending',
    date: '2024-03-11',
  }
];
