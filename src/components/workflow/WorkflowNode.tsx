import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export interface WorkflowNodeData extends Record<string, unknown> {
  title: string;
  description?: string;
  type: 'workflow' | 'stage' | 'data' | 'process' | 'pmf-tag';
  items?: string[];
  onClick?: () => void;
  entitiesExpanded?: boolean;
  onToggleEntities?: () => void;
  isSelected?: boolean;
}

const WorkflowNode = ({ data }: NodeProps) => {
  const nodeData = data as WorkflowNodeData;
  const getNodeStyles = () => {
    switch (nodeData.type) {
      case 'workflow':
        return 'bg-workflow-main-bg border-workflow-main-border border-2 border-dashed rounded-lg min-w-[600px] min-h-[450px] p-8 relative';
      case 'stage':
        return 'bg-workflow-stage-bg border-workflow-stage-border border-2 rounded p-4 min-w-[200px] min-h-[80px] cursor-pointer hover:shadow-md transition-shadow';
      case 'data':
        const bgColor = nodeData.isSelected ? 'bg-yellow-200' : 'bg-white';
        return `${bgColor} border-gray-400 border-2 px-4 py-3 text-sm font-medium cursor-pointer hover:shadow-md transition-shadow transform skew-x-[-15deg]`;
      case 'pmf-tag':
        return 'bg-workflow-pmf-bg text-workflow-pmf-text px-4 py-2 rounded text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-400';
      case 'process':
        return 'bg-workflow-process-bg text-workflow-process-text border-workflow-stage-border border rounded px-3 py-1 text-sm font-medium cursor-pointer hover:shadow-md transition-shadow';
      default:
        return 'bg-workflow-node-bg border-workflow-node-border border rounded p-3 cursor-pointer hover:shadow-md transition-shadow';
    }
  };

  const handleClick = () => {
    if (nodeData.onClick) {
      nodeData.onClick();
    }
    console.log(`Clicked ${nodeData.type} node:`, nodeData.title);
  };

  if (nodeData.type === 'pmf-tag') {
    return (
      <div className={getNodeStyles()} onClick={handleClick}>
        <div className="transform skew-x-[15deg]">
          {nodeData.title}
        </div>
      </div>
    );
  }

  if (nodeData.type === 'data') {
    return (
      <div className={getNodeStyles()} onClick={handleClick}>
        <div className="transform skew-x-[15deg] flex items-center gap-2">
          <span>{nodeData.title}</span>
          <span className="text-xs">⋮</span>
        </div>
      </div>
    );
  }

  if (nodeData.type === 'workflow') {
    return (
      <div className={getNodeStyles()}>        
        <div className="text-2xl font-bold text-foreground mb-2">
          {nodeData.title}
        </div>
        
        {nodeData.description && (
          <div className="text-base text-foreground mb-8">
            {nodeData.description}
          </div>
        )}

        <div className="space-y-6">
          {/* Stage and Enrich boxes will be positioned inside */}
        </div>

        {/* Expand/Collapse Button for Data Entities */}
        <div className="absolute bottom-4 left-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (nodeData.onToggleEntities) {
                nodeData.onToggleEntities();
              }
            }}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Modified Data Entities
            <svg 
              className={`w-4 h-4 transition-transform ${nodeData.entitiesExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={getNodeStyles()} onClick={handleClick}>
      <div className="text-lg font-bold text-foreground mb-3">
        {nodeData.title}
      </div>
      {nodeData.description && (
        <div className="text-sm text-foreground leading-relaxed">
          {nodeData.description}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-workflow-border rounded-none border-2 border-workflow-border" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-workflow-border rounded-none border-2 border-workflow-border" />
    </div>
  );
};

export default memo(WorkflowNode);