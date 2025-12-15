import * as ticketService from '../services/ticketService.js';
import { dataStore } from '../data.js';

export function getAllTickets(req, res) {
  try {
    const tickets = dataStore.tickets.map(ticket => {
      const master = dataStore.masters.find(m => m.id === ticket.masterId);
      const tool = dataStore.tools.find(t => t.id === ticket.toolId);
      return {
        ...ticket,
        master: master?.name || '',
        tool: tool?.name || '',
        isCritical: ticket.state === 'Critical'
      };
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function getTicket(req, res) {
  try {
    const ticket = dataStore.tickets.find(t => t.id === req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    const master = dataStore.masters.find(m => m.id === ticket.masterId);
    const tool = dataStore.tools.find(t => t.id === ticket.toolId);
    
    res.json({
      ...ticket,
      master: master?.name || '',
      tool: tool?.name || '',
      isCritical: ticket.state === 'Critical'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function createTicket(req, res) {
  try {
    const { masterId, toolId } = req.body;
    if (!masterId || !toolId) {
      return res.status(400).json({ error: 'masterId and toolId are required' });
    }
    const ticket = ticketService.createTicket(masterId, toolId);
    const master = dataStore.masters.find(m => m.id === ticket.masterId);
    const tool = dataStore.tools.find(t => t.id === ticket.toolId);
    
    res.status(201).json({
      ...ticket,
      master: master?.name || '',
      tool: tool?.name || '',
      isCritical: false
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export function addJobRequest(req, res) {
  try {
    const { jobRequest } = req.body;
    if (!jobRequest || jobRequest.trim() === '') {
      return res.status(400).json({ error: 'jobRequest is required' });
    }
    const ticket = ticketService.updateJobRequest(req.params.id, jobRequest);
    const master = dataStore.masters.find(m => m.id === ticket.masterId);
    const tool = dataStore.tools.find(t => t.id === ticket.toolId);
    
    res.json({
      ...ticket,
      master: master?.name || '',
      tool: tool?.name || '',
      isCritical: ticket.state === 'Critical'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export function transitionState(req, res) {
  try {
    const { toState } = req.body;
    if (!toState) {
      return res.status(400).json({ error: 'toState is required' });
    }
    const ticket = ticketService.transitionState(req.params.id, toState);
    const master = dataStore.masters.find(m => m.id === ticket.masterId);
    const tool = dataStore.tools.find(t => t.id === ticket.toolId);
    
    res.json({
      ...ticket,
      master: master?.name || '',
      tool: tool?.name || '',
      isCritical: ticket.state === 'Critical'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export function getAuditLogs(req, res) {
  try {
    const logs = ticketService.getAuditLogs(req.params.id);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
