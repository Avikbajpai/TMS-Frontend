import { ticketRepository } from './repositories';
import { Ticket, TicketStatus, UserRole } from '../types';
import { CreateTicketDTO, TicketResponseDTO, DashboardStatsDTO } from './dtos';

/**
 * Service Layer - Business Logic
 */
export class TicketService {
  async getAllTickets(filters?: { status?: string, priority?: string }): Promise<TicketResponseDTO[]> {
    let tickets = await ticketRepository.findAll();
    
    if (filters?.status) {
      tickets = tickets.filter(t => t.status === filters.status);
    }
    if (filters?.priority) {
      tickets = tickets.filter(t => t.priority === filters.priority);
    }

    return Promise.all(tickets.map(t => this.mapToDTO(t)));
  }

  async getTicketById(id: string): Promise<TicketResponseDTO | null> {
    const ticket = await ticketRepository.findById(id);
    if (!ticket) return null;
    return this.mapToDTO(ticket);
  }

  async createTicket(dto: CreateTicketDTO, userId: string): Promise<TicketResponseDTO> {
    const newTicket: Ticket = {
      id: `t-${Math.random().toString(36).substr(2, 9)}`,
      ...dto,
      status: TicketStatus.OPEN,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const saved = await ticketRepository.save(newTicket);
    return this.mapToDTO(saved);
  }

  async assignTicket(ticketId: string, engineerId: string, actorRole: UserRole): Promise<TicketResponseDTO> {
    if (actorRole !== UserRole.ADMIN) {
      throw new Error('Only admins can assign tickets');
    }

    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const engineer = await ticketRepository.findUserById(engineerId);
    if (!engineer || engineer.role !== UserRole.ENGINEER) {
      throw new Error('Invalid engineer ID');
    }

    ticket.assignedTo = engineerId;
    ticket.status = TicketStatus.IN_PROGRESS;
    const saved = await ticketRepository.save(ticket);
    return this.mapToDTO(saved);
  }

  async updateStatus(ticketId: string, status: TicketStatus, actorId: string, actorRole: UserRole): Promise<TicketResponseDTO> {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    // Business Rules
    if (actorRole === UserRole.CUSTOMER && ticket.createdBy !== actorId) {
      throw new Error('Permission denied');
    }
    
    if (actorRole === UserRole.ENGINEER && ticket.assignedTo !== actorId) {
       // Engineers can pick up unassigned tickets by setting status to IN_PROGRESS
       if (!ticket.assignedTo && status === TicketStatus.IN_PROGRESS) {
         ticket.assignedTo = actorId;
       } else {
         throw new Error('You can only update tickets assigned to you');
       }
    }

    ticket.status = status;
    const saved = await ticketRepository.save(ticket);
    return this.mapToDTO(saved);
  }

  async getDashboardStats(): Promise<DashboardStatsDTO> {
    const tickets = await ticketRepository.findAll();
    const stats: DashboardStatsDTO = {
      total: tickets.length,
      open: tickets.filter(t => t.status === TicketStatus.OPEN).length,
      inProgress: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
      resolved: tickets.filter(t => t.status === TicketStatus.RESOLVED).length,
      closed: tickets.filter(t => t.status === TicketStatus.CLOSED).length,
      byPriority: {
        LOW: tickets.filter(t => t.priority === 'LOW').length,
        MEDIUM: tickets.filter(t => t.priority === 'MEDIUM').length,
        HIGH: tickets.filter(t => t.priority === 'HIGH').length,
        URGENT: tickets.filter(t => t.priority === 'URGENT').length,
      }
    };
    return stats;
  }

  async getEngineers() {
     return ticketRepository.findUsersByRole(UserRole.ENGINEER);
  }

  private async mapToDTO(ticket: Ticket): Promise<TicketResponseDTO> {
    const creator = await ticketRepository.findUserById(ticket.createdBy);
    const assignee = ticket.assignedTo ? await ticketRepository.findUserById(ticket.assignedTo) : undefined;

    return {
      ...ticket,
      createdBy: {
        id: creator?.id || 'unknown',
        name: creator?.name || 'Unknown User',
        role: creator?.role || 'CUSTOMER'
      },
      assignedTo: assignee ? {
        id: assignee.id,
        name: assignee.name,
        role: assignee.role
      } : undefined,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
    };
  }
}

export const ticketService = new TicketService();
