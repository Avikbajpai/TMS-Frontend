import express, { Request, Response } from 'express';
import { ticketService } from './services';
import { CreateTicketSchema, UpdateTicketStatusSchema, AssignTicketSchema } from './dtos';
import { UserRole } from '../types';

const router = express.Router();

// Middleware to simulate authentication (in a real app, use JWT/Session)
const authMiddleware = (req: any, res: Response, next: any) => {
  const userId = req.headers['x-user-id'] as string || 'u1';
  const userRole = req.headers['x-user-role'] as UserRole || UserRole.CUSTOMER;
  req.user = { id: userId, role: userRole };
  next();
};

router.use(authMiddleware);

// GET /tickets
router.get('/', async (req: any, res: Response) => {
  try {
    const tickets = await ticketService.getAllTickets(req.query);
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /tickets/stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await ticketService.getDashboardStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /tickets/engineers
router.get('/engineers', async (req, res) => {
  try {
    const engineers = await ticketService.getEngineers();
    res.json(engineers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /tickets/:id
router.get('/:id', async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /tickets
router.post('/', async (req: any, res: Response) => {
  try {
    const validated = CreateTicketSchema.parse(req.body);
    const ticket = await ticketService.createTicket(validated, req.user.id);
    res.status(201).json(ticket);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /tickets/:id/status
router.put('/:id/status', async (req: any, res: Response) => {
  try {
    const { status } = UpdateTicketStatusSchema.parse(req.body);
    const ticket = await ticketService.updateStatus(req.params.id, status, req.user.id, req.user.role);
    res.json(ticket);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /tickets/:id/assign
router.put('/:id/assign', async (req: any, res: Response) => {
  try {
    const { engineerId } = AssignTicketSchema.parse(req.body);
    const ticket = await ticketService.assignTicket(req.params.id, engineerId, req.user.role);
    res.json(ticket);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
