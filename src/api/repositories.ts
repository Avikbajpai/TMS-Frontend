import { Ticket, User, UserRole } from '../types';

/**
 * Mock Repository - Layer for data persistence logic
 */
class TicketRepository {
  private tickets: Ticket[] = [];
  private users: User[] = [
    { id: 'u1', name: 'Alice Customer', email: 'alice@example.com', role: UserRole.CUSTOMER },
    { id: 'u2', name: 'Bob Engineer', email: 'bob@example.com', role: UserRole.ENGINEER },
    { id: 'u3', name: 'Charlie Admin', email: 'charlie@example.com', role: UserRole.ADMIN },
    { id: 'u4', name: 'Dave Engineer', email: 'dave@example.com', role: UserRole.ENGINEER },
  ];

  constructor() {
    // Seed some data
    this.seed();
  }

  private seed() {
    this.tickets.push({
      id: 't1',
      title: 'Database connection timeout',
      description: 'The production database is throwing timeouts every 5 minutes.',
      status: 'OPEN' as any,
      priority: 'URGENT' as any,
      category: 'Infrastructure',
      createdBy: 'u1',
      createdAt: new Date(Date.now() - 3600000 * 2),
      updatedAt: new Date(Date.now() - 3600000 * 2),
    });
    this.tickets.push({
      id: 't2',
      title: 'UI glitch in dashboard',
      description: 'The charts are overlapping on small screens.',
      status: 'IN_PROGRESS' as any,
      priority: 'MEDIUM' as any,
      category: 'UI/UX',
      createdBy: 'u1',
      assignedTo: 'u2',
      createdAt: new Date(Date.now() - 3600000 * 24),
      updatedAt: new Date(),
    });
  }

  async findAll(): Promise<Ticket[]> {
    return this.tickets;
  }

  async findById(id: string): Promise<Ticket | undefined> {
    return this.tickets.find(t => t.id === id);
  }

  async save(ticket: Ticket): Promise<Ticket> {
    const index = this.tickets.findIndex(t => t.id === ticket.id);
    if (index >= 0) {
      this.tickets[index] = { ...ticket, updatedAt: new Date() };
    } else {
      this.tickets.push(ticket);
    }
    return ticket;
  }

  async findUserById(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async findUsersByRole(role: UserRole): Promise<User[]> {
    return this.users.filter(u => u.role === role);
  }
}

export const ticketRepository = new TicketRepository();
