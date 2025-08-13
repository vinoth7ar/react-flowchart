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
  color?: string;
}

const WorkflowNode = ({ data }: NodeProps) => {
  const nodeData = data as WorkflowNodeData;
  const getNodeStyles = () => {
    switch (nodeData.type) {
      case 'workflow':
        return 'bg-white border-2 border-dotted border-gray-400 rounded-lg min-w-[600px] min-h-[350px] p-8 relative';
      case 'stage':
        if (nodeData.color === 'green') {
          return 'bg-green-100 border-green-400 border-2 rounded p-4 min-w-[250px] min-h-[120px] cursor-pointer hover:shadow-md transition-shadow';
        } else if (nodeData.color === 'blue') {
          return 'bg-blue-100 border-blue-400 border-2 rounded p-4 min-w-[250px] min-h-[120px] cursor-pointer hover:shadow-md transition-shadow';
        }
        return 'bg-gray-100 border-gray-400 border-2 rounded p-4 min-w-[250px] min-h-[120px] cursor-pointer hover:shadow-md transition-shadow';
      case 'data':
        let bgColor = 'bg-white';
        if (nodeData.color === 'yellow') {
          bgColor = nodeData.isSelected ? 'bg-yellow-300' : 'bg-yellow-200';
        } else {
          bgColor = nodeData.isSelected ? 'bg-yellow-200' : 'bg-white';
        }
        return `${bgColor} border-gray-400 border-2 px-4 py-3 text-sm font-medium cursor-pointer hover:shadow-md transition-shadow transform skew-x-[-15deg]`;
      case 'pmf-tag':
        return 'bg-black text-white px-3 py-2 rounded text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-400';
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
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            See Data Entities
            <svg 
              className={`w-4 h-4 transition-transform ${nodeData.entitiesExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
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