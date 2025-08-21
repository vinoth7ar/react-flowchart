import { useMemo } from 'react';
import WorkflowBuilder from '@/components/workflow/WorkflowBuilder';
import { mockWorkflows } from '@/components/workflow/mock-data';
import type { WorkflowData } from '@/components/workflow/types';

interface SingleViewVisualizationProps {
  workflowId: string;
}

const SingleViewVisualization = ({ workflowId }: SingleViewVisualizationProps) => {
  // Get workflow data - fallback to mock data
  const workflowData: WorkflowData | null = useMemo(() => {
    return mockWorkflows[workflowId] || null;
  }, [workflowId]);

  if (!workflowData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-workflow-canvas">
        <div className="text-center p-8 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Workflow Not Found</h3>
          <p className="text-muted-foreground">
            The workflow "{workflowId}" could not be loaded
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-workflow-canvas">
      <WorkflowBuilder 
        selectedWorkflowId={workflowId}
        workflowData={workflowData}
        onWorkflowSelect={() => {}} // Not needed here as handled by parent
      />
    </div>
  );
};

export default SingleViewVisualization;