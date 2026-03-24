import { ObjectId } from 'mongodb';

export type ChatStatus =
  | 'idle'
  | 'pending'
  | 'processing'
  | 'preview_ready'
  | 'approved'
  | 'deploying'
  | 'failed';

export interface ChatMessage {
  role: 'elora' | 'system';
  content: string;
  createdAt: Date;
}

export interface ChatState {
  _id: ObjectId;
  status: ChatStatus;
  messages: ChatMessage[];
  previewUrl?: string;
  previewBranch?: string;
  changeSummary?: string;
  activeMessageIndex?: number;
  updatedAt: Date;
}

export const STATUS_LABELS: Record<ChatStatus, string> = {
  idle: 'Ready',
  pending: 'Queued',
  processing: 'Processing',
  preview_ready: 'Preview Ready',
  approved: 'Approved',
  deploying: 'Deploying',
  failed: 'Failed',
};

export const STATUS_COLORS: Record<ChatStatus, string> = {
  idle: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  preview_ready: 'bg-green-100 text-green-800',
  approved: 'bg-indigo-100 text-indigo-800',
  deploying: 'bg-indigo-100 text-indigo-800',
  failed: 'bg-red-100 text-red-800',
};
