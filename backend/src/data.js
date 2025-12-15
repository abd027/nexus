// In-memory data store
export const dataStore = {
  tickets: [],
  auditLogs: [],
  masters: [
    { id: 'master-1', name: 'Zeus', description: 'Primary diagnostics master' },
    { id: 'master-2', name: 'Phoenix', description: 'Programming master' }
  ],
  tools: [
    { id: 'tool-1', name: 'Diagnostic Scanner A', masterId: 'master-1' },
    { id: 'tool-2', name: 'Programming Tool B', masterId: 'master-2' }
  ]
};
