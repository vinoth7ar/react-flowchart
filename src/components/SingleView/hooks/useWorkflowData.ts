import { useMemo } from 'react';
import { mockWorkflows } from '@/components/workflow/mock-data';
import { WorkflowData } from '@/components/workflow/types';

export function useWorkflowData(type: 'workflow' | 'entity' | null, id: string | null): WorkflowData | null {
  return useMemo(() => {
    if (!type || !id) return null;

    // For MVP, we're only handling workflows from mock data
    // In the future, this can be extended to handle entities differently
    const workflowData = mockWorkflows[id];
    
    if (!workflowData) {
      console.warn(`No workflow data found for id: ${id}`);
      return null;
    }

    return workflowData;
  }, [type, id]);
}

export function useAvailableOptions() {
  return useMemo(() => {
    // Convert mock workflows to selection options
    const workflowOptions = Object.entries(mockWorkflows).map(([id, data]) => ({
      id,
      title: data.workflow.title,
      description: data.workflow.description,
      category: 'workflow' as const,
    }));

    // For MVP, we only have workflows
    // In the future, add entity options here
    const entityOptions: any[] = [];

    return {
      workflows: workflowOptions,
      entities: entityOptions,
    };
  }, []);
}