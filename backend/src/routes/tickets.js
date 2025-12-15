import express from 'express';
import * as ticketController from '../controllers/ticketController.js';

const router = express.Router();

router.get('/', ticketController.getAllTickets);
router.get('/:id', ticketController.getTicket);
router.post('/', ticketController.createTicket);
router.post('/:id/job-request', ticketController.addJobRequest);
router.post('/:id/transition', ticketController.transitionState);
router.get('/:id/logs', ticketController.getAuditLogs);

export default router;
