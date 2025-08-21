import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronLeft, ChevronRight, Settings, Eye } from 'lucide-react';
import { mockWorkflows } from '@/components/workflow/mock-data';

interface CollapsibleWorkflowSidebarProps {
  selectedWorkflow: string;
  onWorkflowSelect: (workflowId: string) => void;
}

const CollapsibleWorkflowSidebar = ({ 
  selectedWorkflow, 
  onWorkflowSelect 
}: CollapsibleWorkflowSidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const legendItems = [
    { color: 'bg-primary', label: 'Application' },
    { color: 'bg-workflow-stage-bg border border-workflow-stage-border', label: 'Workflow' },
    { color: 'bg-muted', label: 'Business Goal' },
    { color: 'bg-workflow-data-bg border border-workflow-data-border', label: 'Data Entity' },
  ];

  const workflows = Object.entries(mockWorkflows).map(([id, data]) => ({
    id,
    name: data.workflow.title,
    description: data.workflow.description,
  }));

  const handleWorkflowSelect = (workflowId: string) => {
    onWorkflowSelect(workflowId);
    navigate(`/visualization/workflow/${workflowId}`);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={`relative transition-all duration-300 ${isOpen ? 'w-80' : 'w-12'}`}>
        {/* Toggle Button */}
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 -right-3 z-10 rounded-full w-6 h-6 p-0 bg-background border shadow-md hover:shadow-lg"
          >
            {isOpen ? (
              <ChevronLeft className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        </CollapsibleTrigger>

        {/* Collapsed State - Mini Icons */}
        {!isOpen && (
          <div className="w-12 bg-sidebar border-r border-sidebar-border h-full p-2 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full p-0 h-8"
              onClick={() => setIsOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full p-0 h-8"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Expanded Content */}
        <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="w-80 bg-sidebar border-r border-sidebar-border p-4 space-y-4 h-full">
            {/* Customize View */}
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-3">Customize View</h3>
              <div className="flex items-center space-x-2">
                <Checkbox id="expand-entities" defaultChecked />
                <label 
                  htmlFor="expand-entities" 
                  className="text-xs cursor-pointer"
                >
                  Expand all data entities
                </label>
              </div>
            </Card>

            {/* Legend */}
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-3">Legend</h3>
              <div className="space-y-2">
                {legendItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${item.color}`} />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Available Workflows */}
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-3">Available Workflows</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Choose a workflow to visualize
              </p>
              <div className="space-y-2">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className={`bg-workflow-stage-bg border rounded p-3 text-xs font-medium text-center cursor-pointer transition-colors ${
                      selectedWorkflow === workflow.id 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-workflow-stage-border hover:bg-workflow-stage-border/20'
                    }`}
                    onClick={() => handleWorkflowSelect(workflow.id)}
                  >
                    <div className="font-medium">{workflow.name}</div>
                    {workflow.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {workflow.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default CollapsibleWorkflowSidebar;