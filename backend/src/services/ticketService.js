import { dataStore } from '../data.js';
import { canTransition } from './stateMachine.js';

let ticketCounter = 1;

export function createTicket(masterId, toolId) {
  const master = dataStore.masters.find(m => m.id === masterId);
  const tool = dataStore.tools.find(t => t.id === toolId);
  
  if (!master) throw new Error('Master not found');
  if (!tool) throw new Error('Tool not found');
  if (tool.masterId !== masterId) throw new Error('Tool does not belong to selected master');

  const ticket = {
    id: `ticket-${Date.now()}`,
    ticketNumber: `TKT-${String(ticketCounter++).padStart(5, '0')}`,
    masterId,
    toolId,
    state: 'Waiting',
    jobRequest: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  dataStore.tickets.push(ticket);
  
  // Create audit log
  addAuditLog(ticket.id, 'Created', 'Ticket created');
  
  return ticket;
}

export function updateJobRequest(ticketId, jobRequest) {
  const ticket = dataStore.tickets.find(t => t.id === ticketId);
  if (!ticket) throw new Error('Ticket not found');
  if (ticket.state !== 'Waiting') {
    throw new Error('Job request can only be updated for tickets in Waiting state');
  }

  ticket.jobRequest = jobRequest;
  ticket.updatedAt = new Date().toISOString();
  
  addAuditLog(ticketId, 'Job Request Updated', 'Job request modified');
  
  return ticket;
}

export function transitionState(ticketId, toState) {
  const ticket = dataStore.tickets.find(t => t.id === ticketId);
  if (!ticket) throw new Error('Ticket not found');

  // Validate transition
  if (!canTransition(ticket.state, toState)) {
    throw new Error(`Invalid transition from ${ticket.state} to ${toState}`);
  }

  // Check job request requirement for Waiting → Monitoring
  if (ticket.state === 'Waiting' && toState === 'Monitoring') {
    if (!ticket.jobRequest || ticket.jobRequest.trim() === '') {
      throw new Error('Job request is required to start monitoring');
    }
  }

  // Check Critical lock: One master can only have one critical ticket
  if (toState === 'Critical') {
    const existingCritical = dataStore.tickets.find(
      t => t.masterId === ticket.masterId && t.state === 'Critical' && t.id !== ticketId
    );
    if (existingCritical) {
      throw new Error(
        `Cannot set ticket to Critical: Master already has a critical ticket (${existingCritical.ticketNumber})`
      );
    }
  }

  const fromState = ticket.state;
  ticket.state = toState;
  ticket.updatedAt = new Date().toISOString();

  addAuditLog(ticketId, 'State Changed', `State changed from ${fromState} to ${toState}`);
  
  return ticket;
}

function addAuditLog(ticketId, action, details) {
  const log = {
    id: `log-${ticketId}-${Date.now()}`,
    ticketId,
    action,
    user: 'system',
    timestamp: new Date().toISOString(),
    details
  };
  dataStore.auditLogs.push(log);
  return log;
}

export function getAuditLogs(ticketId) {
  return dataStore.auditLogs.filter(log => log.ticketId === ticketId);
}
