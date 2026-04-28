export type UserRole = 'admin' | 'instructor' | 'supervisor';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
  specialization?: string;
  permissions?: string[];
  createdAt: string;
}

export interface Specialization {
  id: string;
  nameEn: string;
  nameAr: string;
  description: string;
}

export interface Group {
  id: string;
  name: string;
  specializationId: string;
  instructorId: string;
  schedule: {
    startTime: string;
    endTime: string;
    days: string[]; // e.g. ["Sunday", "Monday"]
  };
  status: 'active' | 'completed' | 'pending';
  startDate: string;
  endDate: string;
}

export interface Trainee {
  id: string;
  jobId: string;
  fullName: string;
  companyName: string;
  mobile: string;
  email: string;
  specializationId: string;
  groupId: string;
  enrollmentStart: string;
  enrollmentEnd: string;
}

export type AttendanceStatus = 'P' | 'A' | 'E' | 'H' | 'L';

export interface AttendanceRecord {
  id?: string;
  traineeId: string;
  groupId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedBy: string;
  timestamp: any;
}

export interface EvaluationRecord {
  id?: string;
  traineeId: string;
  groupId: string;
  month: number;
  year: number;
  score1: number;
  score2: number;
  average: number;
  grade: 'Poor' | 'Good' | 'Very Good' | 'Excellent';
  submittedBy: string;
}
