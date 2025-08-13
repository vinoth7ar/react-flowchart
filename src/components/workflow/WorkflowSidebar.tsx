import { Card } from '@/components/ui/card';

const WorkflowSidebar = () => {
  const legendItems = [
    { color: 'bg-primary', label: 'Application' },
    { color: 'bg-workflow-stage-bg border border-workflow-stage-border', label: 'Workflow' },
    { color: 'bg-muted', label: 'Business Goal' },
    { color: 'bg-workflow-data-bg border border-workflow-data-border', label: 'Data Entity' },
  ];

  const workflows = [
    'Workflow Name',
    'Workflow Name',
    'Workflow Name',
    'Workflow Name',
  ];

  return (
    <div className="w-80 bg-workflow-bg border-l border-workflow-border p-4 space-y-4">
      {/* Customize View */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-3">Customize View</h3>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" defaultChecked className="rounded" />
          Expand all data entities
        </label>
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

      {/* Other Workflows */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-3">Other Workflows</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Choose a different workflow to visualize
        </p>
        <div className="space-y-2">
          {workflows.map((workflow, index) => (
            <div
              key={index}
              className="bg-workflow-stage-bg border border-workflow-stage-border rounded p-3 text-xs font-medium text-center cursor-pointer hover:bg-workflow-stage-border/20 transition-colors"
            >
              {workflow}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default WorkflowSidebar;
