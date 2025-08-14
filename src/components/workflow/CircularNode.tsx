import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export interface CircularNodeData extends Record<string, unknown> {
  label: string;
  onClick?: () => void;
  color?: string;
}

const CircularNode = ({ data }: NodeProps) => {
  const nodeData = data as CircularNodeData;
  
  const handleClick = () => {
    if (nodeData.onClick) {
      nodeData.onClick();
    }
    console.log('Clicked status node:', nodeData.label);
  };

  const getCircleStyles = () => {
    return 'w-20 h-20 rounded-full bg-gray-300 border border-gray-500 flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-shadow';
  };

  return (
    <div 
      className={getCircleStyles()}
      onClick={handleClick}
    >
      <div className="text-xs font-medium text-center text-black px-2 leading-tight">
        {nodeData.label}
      </div>
      
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-workflow-border rounded-none border-2 border-workflow-border" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-workflow-border rounded-none border-2 border-workflow-border" />
    </div>
  );
};

export default memo(CircularNode);