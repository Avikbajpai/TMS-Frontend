import { z } from 'zod';
import { TicketStatus, TicketPriority } from '../types';

export const CreateTicketSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(2000),
  priority: z.nativeEnum(TicketPriority),
  category: z.string().min(2).max(50),
});

export type CreateTicketDTO = z.infer<typeof CreateTicketSchema>;

export const UpdateTicketStatusSchema = z.object({
  status: z.nativeEnum(TicketStatus),
});

export const AssignTicketSchema = z.object({
  engineerId: z.string(),
});

export interface TicketResponseDTO {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStatsDTO {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byPriority: Record<TicketPriority, number>;
}
