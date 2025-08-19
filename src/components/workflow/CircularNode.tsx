import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

export interface CircularNodeData extends Record<string, unknown> {
  label: string;
  onClick?: () => void;
  color?: string;
}

const CircularNode = ({ data }: NodeProps<CircularNodeData>) => {
  const nodeData = data as CircularNodeData;
  
  const handleClick = () => {
    if (nodeData.onClick) {
      nodeData.onClick();
    }
    console.log('Clicked status node:', nodeData.label);
  };

  const getCircleStyles = () => {
    return 'w-16 h-16 rounded-full bg-workflow-circular border border-workflow-circular-border flex items-center justify-center shadow-md cursor-pointer hover:shadow-lg transition-all duration-200';
  };

  return (
    <div 
      className={getCircleStyles()}
      onClick={handleClick}
    >
      <div className="text-[10px] font-bold text-center text-foreground px-1 leading-tight">
        {nodeData.label}
      </div>
      
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-workflow-border rounded-none border border-workflow-border opacity-0" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-workflow-border rounded-none border border-workflow-border opacity-0" />
    </div>
  );
};

export default memo(CircularNode);