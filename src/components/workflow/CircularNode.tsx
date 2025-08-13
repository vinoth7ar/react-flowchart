import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export interface CircularNodeData extends Record<string, unknown> {
  label: string;
}

const CircularNode = ({ data }: NodeProps) => {
  const nodeData = data as CircularNodeData;
  return (
    <div className="w-16 h-16 rounded-full bg-workflow-circular border-2 border-workflow-circular-border flex items-center justify-center">
      <div className="text-xs font-medium text-center text-foreground px-1">
        {nodeData.label}
      </div>
      
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-workflow-node-border" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-workflow-node-border" />
    </div>
  );
};

export default memo(CircularNode);