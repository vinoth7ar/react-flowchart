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
        return 'bg-workflow-main-bg border-workflow-main-border border-2 rounded-none min-w-[500px] min-h-[350px] p-6';
      case 'stage':
        return 'bg-workflow-stage-bg border-workflow-stage-border border-2 rounded-none p-4 min-w-[180px] min-h-[80px]';
      case 'data':
        return 'bg-workflow-data-bg border-workflow-data-border border rounded-sm px-3 py-2 text-sm font-medium';
      case 'process':
        return 'bg-workflow-process-bg text-workflow-process-text border-workflow-stage-border border rounded px-3 py-1 text-sm font-medium';
      default:
        return 'bg-workflow-node-bg border-workflow-node-border border rounded p-3';
    }
  };

  if (nodeData.type === 'workflow') {
    return (
      <div className={getNodeStyles()}>
        <div className="flex items-start gap-3 mb-6">
          <div className="bg-workflow-pmf-bg text-workflow-pmf-text px-3 py-1 rounded-none text-sm font-bold">
            PMF
          </div>
        </div>
        
        <div className="text-xl font-bold text-foreground mb-2">
          {nodeData.title}
        </div>
        
        {nodeData.description && (
          <div className="text-sm text-foreground mb-8">
            {nodeData.description}
          </div>
        )}

        <div className="space-y-6">
          {/* Stage and Enrich boxes will be positioned inside */}
        </div>

        {nodeData.items && nodeData.items.length > 0 && (
          <div className="mt-8 pt-4 border-t border-foreground/20">
            <div className="text-sm font-bold mb-4 flex items-center gap-2">
              Modified Data Entities
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="flex flex-wrap gap-3">
              {nodeData.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-workflow-data-bg border-workflow-data-border border-2 px-4 py-2 text-sm font-medium transform -skew-x-12"
                  style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
                >
                  <span className="transform skew-x-12 block">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-workflow-border rounded-none border-2 border-workflow-border" />
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-workflow-border rounded-none border-2 border-workflow-border" />
      </div>
    );
  }

  return (
    <div className={getNodeStyles()}>
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