export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  category: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  date: string;
  assignedDepartment?: string;
  departmentMessage?: string;
  departmentResolutionStatus?: 'Resolved' | 'Not Resolved';
}

export interface Notification {
  id: string;
  userId: string;
  complaintId: string;
  message: string;
  date: string;
  isRead: boolean;
  targetRole?: 'user' | 'admin';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  message: string;
  rating: number; // 1-5
  date: string;
}
