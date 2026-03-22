import { ObjectId } from 'mongodb';

export type SessionStatus =
  | 'pending'
  | 'processing'
  | 'preview_ready'
  | 'approved'
  | 'deployed'
  | 'feedback_pending'
  | 'failed';

export interface SessionMessage {
  role: 'elora' | 'system';
  content: string;
  createdAt: Date;
}

export interface ChangeSession {
  _id: ObjectId;
  status: SessionStatus;
  messages: SessionMessage[];
  previewUrl?: string;
  previewBranch?: string;
  changeSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const STATUS_LABELS: Record<SessionStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  preview_ready: 'Preview Ready',
  approved: 'Approved',
  deployed: 'Deployed',
  feedback_pending: 'Feedback Sent',
  failed: 'Failed',
};

export const STATUS_COLORS: Record<SessionStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  preview_ready: 'bg-green-100 text-green-800',
  approved: 'bg-indigo-100 text-indigo-800',
  deployed: 'bg-slate-100 text-slate-800',
  feedback_pending: 'bg-orange-100 text-orange-800',
  failed: 'bg-red-100 text-red-800',
};
