import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export interface WorkflowNodeData extends Record<string, unknown> {
  title: string;
  description?: string;
  type: 'workflow' | 'stage' | 'data' | 'process' | 'pmf-tag' | 'entities-group';
  items?: string[];
  entities?: Array<{ id: string; title: string; color?: string }>;
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
        return 'bg-gray-200 border-2 border-dotted border-gray-500 rounded-lg min-w-[800px] min-h-[450px] p-4 relative';
      case 'stage':
        return 'bg-white border border-gray-400 rounded p-3 min-w-[220px] min-h-[90px] cursor-pointer hover:shadow-md transition-shadow';
      case 'data':
        let bgColor = 'bg-gray-300';
        if (nodeData.color === 'yellow') {
          bgColor = 'bg-yellow-400';
        }
        return `${bgColor} border border-gray-500 px-3 py-2 text-sm font-medium cursor-pointer hover:shadow-md transition-shadow`;
      case 'pmf-tag':
        return 'bg-black text-white px-2 py-1 text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity';
      case 'process':
        return 'bg-workflow-process-bg text-workflow-process-text border-workflow-stage-border border rounded px-3 py-1 text-sm font-medium cursor-pointer hover:shadow-md transition-shadow';
      case 'entities-group':
        return 'bg-white border border-gray-300 rounded p-3 min-w-[500px] cursor-pointer hover:shadow-md transition-shadow';
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
        <div className="flex items-center gap-2">
          <span>{nodeData.title}</span>
          <span className="text-xs">⋮</span>
        </div>
      </div>
    );
  }

  if (nodeData.type === 'entities-group') {
    const handleIconClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (nodeData.onToggleEntities) {
        nodeData.onToggleEntities();
      }
    };

    return (
      <div className={getNodeStyles()} onClick={handleClick}>
        <div className="text-sm font-medium text-black mb-2 flex items-center gap-2">
          <span 
            className="cursor-pointer select-none"
            onClick={handleIconClick}
          >
            {nodeData.entitiesExpanded ? '▼' : '▲'}
          </span>
          <span>Modified Data Entities</span>
        </div>
        {nodeData.entitiesExpanded && (
          <div className="flex flex-wrap gap-2">
            {nodeData.entities?.map((entity) => {
              const bgColor = entity.color === 'yellow' ? 'bg-yellow-400' : 'bg-gray-300';
              return (
                <div
                  key={entity.id}
                  className={`${bgColor} border border-gray-500 px-2 py-1 text-xs font-medium`}
                >
                  <div className="flex items-center gap-1">
                    <span>{entity.title}</span>
                    <span className="text-xs">⋮</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-workflow-border rounded-none border-2 border-workflow-border" />
      </div>
    );
  }

  if (nodeData.type === 'workflow') {
    return (
      <div className={getNodeStyles()}>        
        <div className="text-xl font-bold text-black mb-1">
          {nodeData.title}
        </div>
        
        {nodeData.description && (
          <div className="text-sm text-black mb-4">
            {nodeData.description}
          </div>
        )}

        <div className="space-y-4">
          {/* Stage and Enrich boxes will be positioned inside */}
        </div>
      </div>
    );
  }

  return (
    <div className={getNodeStyles()} onClick={handleClick}>
      <div className="text-sm font-bold text-foreground mb-1">
        {nodeData.title}
      </div>
      {nodeData.description && (
        <div className="text-xs text-foreground leading-tight">
          {nodeData.description}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-workflow-border rounded-none border-2 border-workflow-border" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-workflow-border rounded-none border-2 border-workflow-border" />
    </div>
  );
};

export default memo(WorkflowNode);