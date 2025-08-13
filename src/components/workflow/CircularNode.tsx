import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export interface CircularNodeData extends Record<string, unknown> {
  label: string;
}

const CircularNode = ({ data }: NodeProps) => {
  const nodeData = data as CircularNodeData;
  return (
    <div className="w-20 h-20 rounded-full bg-workflow-circular border-2 border-workflow-circular-border flex items-center justify-center shadow-sm">
      <div className="text-xs font-medium text-center text-foreground px-2 leading-tight">
        {nodeData.label}
      </div>
      
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-workflow-border rounded-none border-2 border-workflow-border" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-workflow-border rounded-none border-2 border-workflow-border" />
    </div>
  );
};

export default memo(CircularNode);