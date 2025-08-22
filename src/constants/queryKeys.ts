export const queryKeys = {
  workflows: {
    all: ['workflows'],
    lists: () => [...queryKeys.workflows.all, 'list'],
    list: (filters: string) => [...queryKeys.workflows.lists(), { filters }],
    details: () => [...queryKeys.workflows.all, 'detail'],
    detail: (id: string) => [...queryKeys.workflows.details(), id],
    search: (searchText: string) => [...queryKeys.workflows.all, 'search', searchText],
  },
  workflowStages: {
    all: ['workflowStages'],
    byWorkflow: (workflowId: string) => [...queryKeys.workflowStages.all, 'byWorkflow', workflowId],
  },
  workflowEntities: {
    all: ['workflowEntities'],
    byWorkflow: (workflowId: string) => [...queryKeys.workflowEntities.all, 'byWorkflow', workflowId],
  },
};