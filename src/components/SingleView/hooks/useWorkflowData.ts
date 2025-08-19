import { useMemo, useState, useEffect } from 'react';
import { mockWorkflows } from '@/components/workflow/mock-data';
import { WorkflowData } from '@/components/workflow/types';

// Backend integration hook
export function useWorkflowData(type: 'workflow' | 'entity' | null, id: string | null): WorkflowData | null {
  const [backendData, setBackendData] = useState<WorkflowData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch from backend
  const fetchWorkflowFromBackend = async (workflowId: string): Promise<WorkflowData | null> => {
    try {
      // TODO: Replace with actual backend API call
      // const response = await fetch(`/api/workflows/${workflowId}`);
      // const data = await response.json();
      // return data;
      
      // For now, simulate backend delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockWorkflows[workflowId] || null;
    } catch (err) {
      console.error('Failed to fetch workflow from backend:', err);
      return null;
    }
  };

  // Effect to load data when type/id changes
  useEffect(() => {
    if (!type || !id) {
      setBackendData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchWorkflowFromBackend(id)
      .then(data => {
        setBackendData(data);
        if (!data) {
          setError(`No ${type} found with id: ${id}`);
        }
      })
      .catch(err => {
        setError(err.message);
        setBackendData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [type, id]);

  return useMemo(() => {
    if (!type || !id) return null;
    
    // Return backend data if available, otherwise fallback to mock data
    return backendData || mockWorkflows[id] || null;
  }, [type, id, backendData]);
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

// Hook to get available workflows for sidebar
export function useAvailableWorkflows() {
  return useMemo(() => {
    return Object.entries(mockWorkflows).map(([id, data]) => ({
      id,
      title: data.workflow.title,
      description: data.workflow.description,
    }));
  }, []);
}