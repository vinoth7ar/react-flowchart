// Hook to integrate workflow data with React Flow
import { useMemo } from 'react';
import { mockWorkflows } from '../components/workflow/mock-data';
import { WorkflowData } from '../components/workflow/types';

export const useWorkflowData = (workflowId?: string) => {
  const selectedWorkflow = useMemo(() => {
    if (!workflowId || !mockWorkflows[workflowId]) {
      // Return the first available workflow as default
      const firstKey = Object.keys(mockWorkflows)[0];
      return mockWorkflows[firstKey];
    }
    return mockWorkflows[workflowId];
  }, [workflowId]);

  const availableWorkflows = useMemo(() => {
    return Object.entries(mockWorkflows).map(([key, workflow]) => ({
      id: key,
      title: workflow.workflow.title,
      description: workflow.workflow.description,
    }));
  }, []);

  return {
    selectedWorkflow,
    availableWorkflows,
    isLoading: false,
    error: null,
  };
};