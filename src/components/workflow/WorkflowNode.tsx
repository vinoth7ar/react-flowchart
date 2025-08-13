import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export interface WorkflowNodeData extends Record<string, unknown> {
  title: string;
  description?: string;
  type: 'workflow' | 'stage' | 'data' | 'process';
  items?: string[];
}

const WorkflowNode = ({ data }: NodeProps) => {
  const nodeData = data as WorkflowNodeData;
  const getNodeStyles = () => {
    switch (nodeData.type) {
      case 'workflow':
        return 'bg-workflow-node-bg border-workflow-node-border border-2 rounded-lg min-w-[400px] min-h-[300px] p-4';
      case 'stage':
        return 'bg-workflow-stage-bg border-workflow-stage-border border rounded p-3 min-w-[150px]';
      case 'data':
        return 'bg-workflow-data-bg border-workflow-data-border border rounded p-2 min-w-[120px]';
      case 'process':
        return 'bg-workflow-process-bg text-workflow-process-text border-workflow-stage-border border rounded px-3 py-1 text-sm font-medium';
      default:
        return 'bg-workflow-node-bg border-workflow-node-border border rounded p-3';
    }
  };

  if (nodeData.type === 'workflow') {
    return (
      <div className={getNodeStyles()}>
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-foreground text-background px-2 py-1 rounded text-xs font-medium">
            PMF
          </div>
          <div className="text-sm font-medium text-foreground">
            {nodeData.title}
          </div>
        </div>
        
        {nodeData.description && (
          <div className="text-xs text-muted-foreground mb-4">
            {nodeData.description}
          </div>
        )}

        <div className="space-y-3">
          {/* Stage and Enrich boxes will be positioned inside */}
        </div>

        {nodeData.items && nodeData.items.length > 0 && (
          <div className="mt-6">
            <div className="text-xs font-medium mb-2 flex items-center gap-1">
              Modified Data Entities
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
            <div className="flex flex-wrap gap-2">
              {nodeData.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-workflow-data-bg border-workflow-data-border border rounded px-2 py-1 text-xs"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        <Handle type="target" position={Position.Left} className="w-2 h-2 bg-workflow-node-border" />
        <Handle type="source" position={Position.Right} className="w-2 h-2 bg-workflow-node-border" />
      </div>
    );
  }

  return (
    <div className={getNodeStyles()}>
      <div className="text-xs font-medium text-foreground">
        {nodeData.title}
      </div>
      {nodeData.description && (
        <div className="text-xs text-muted-foreground mt-1">
          {nodeData.description}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-workflow-node-border" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-workflow-node-border" />
    </div>
  );
};

export default memo(WorkflowNode);