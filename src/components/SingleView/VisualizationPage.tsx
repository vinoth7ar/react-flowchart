import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSelection } from './context/SelectionContext';
import { useWorkflowData, useAvailableWorkflows } from './hooks/useWorkflowData';
import WorkflowHeader from '@/components/workflow/WorkflowHeader';
import WorkflowBuilder from '@/components/workflow/WorkflowBuilder';
import WorkflowSidebar from '@/components/workflow/WorkflowSidebar';
import { ArrowLeft, Settings } from 'lucide-react';

export default function VisualizationPage() {
  const { type, id } = useParams<{ type: 'workflow' | 'entity'; id: string }>();
  const navigate = useNavigate();
  const { selection, updateSelection } = useSelection();
  const availableWorkflows = useAvailableWorkflows();
  
  // Get workflow data based on URL params (handles backend integration)
  const workflowData = useWorkflowData(type || null, id || null);

  // Handle workflow switching from sidebar
  const handleWorkflowSelect = (workflowId: string) => {
    navigate(`/visualization/workflow/${workflowId}`);
  };

  // Sync URL params with selection context
  useEffect(() => {
    if (type && id && (selection.selectedType !== type || selection.selectedId !== id)) {
      updateSelection(type, id);
    }
  }, [type, id, selection.selectedType, selection.selectedId, updateSelection]);

  // Handle missing data
  if (!type || !id) {
    return (
      <div className="h-screen flex items-center justify-center bg-workflow-bg">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Invalid URL</h2>
          <p className="text-muted-foreground mb-4">
            Please select a workflow or entity to visualize
          </p>
          <Button onClick={() => navigate('/selection')}>
            Go to Selection
          </Button>
        </div>
      </div>
    );
  }

  if (!workflowData) {
    return (
      <div className="h-screen flex items-center justify-center bg-workflow-bg">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            {type === 'workflow' ? 'Workflow' : 'Entity'} Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The {type} "{id}" could not be loaded
          </p>
          <Button onClick={() => navigate('/selection')}>
            Back to Selection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-workflow-bg">
      {/* Enhanced Header with Navigation */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/selection')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Selection
              </Button>
              <div>
                <h1 className="text-lg font-semibold">
                  {workflowData.workflow.title}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {type === 'workflow' ? 'Workflow' : 'Entity'} Visualization
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => navigate('/selection')}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Change Selection
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Workflow Visualization */}
        <div className="flex-1">
          <WorkflowBuilder 
            selectedWorkflowId={id}
            workflowData={workflowData}
          />
        </div>

        {/* Sidebar for switching workflows */}
        <WorkflowSidebar 
          selectedWorkflow={id || ''}
          onWorkflowSelect={handleWorkflowSelect}
        />
      </div>
    </div>
  );
}