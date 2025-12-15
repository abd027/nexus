// State machine validation - EXACT transition rules
const ALLOWED_TRANSITIONS = {
  'Waiting': ['Monitoring'],
  'Monitoring': ['Ready', 'Hold'],
  'Hold': ['Monitoring'],
  'Ready': ['Critical'],
  'Critical': ['Complete', 'Failed'],
  'Complete': ['Closed'],
  'Failed': ['Closed'],
  'Closed': []
};

export function canTransition(fromState, toState) {
  const allowed = ALLOWED_TRANSITIONS[fromState] || [];
  return allowed.includes(toState);
}

export function getAllowedTransitions(currentState) {
  return ALLOWED_TRANSITIONS[currentState] || [];
}
