import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import WorkflowNode, { WorkflowNodeData } from './WorkflowNode';
import CircularNode, { CircularNodeData } from './CircularNode';
import WorkflowSidebar from './WorkflowSidebar';

const nodeTypes = {
  workflow: WorkflowNode,
  circular: CircularNode,
  stage: WorkflowNode,
  data: WorkflowNode,
};

const initialNodes: Node[] = [
  {
    id: 'main-workflow',
    type: 'workflow',
    position: { x: 100, y: 100 },
    data: {
      title: 'Hypo Loan Position',
      description: 'Workflow description',
      type: 'workflow',
      items: ['Hypo Loan Position', 'Loan Commitment', 'Hypo Loan Base Price'],
    } as WorkflowNodeData,
    style: { width: 550, height: 400 },
  },
  {
    id: 'stage-node',
    type: 'stage',
    position: { x: 40, y: 120 },
    data: {
      title: 'Stage',
      description: 'FLUME stages commitment data in PMF database',
      type: 'stage',
    } as WorkflowNodeData,
    parentId: 'main-workflow',
    extent: 'parent',
    style: { width: 200, height: 100 },
  },
  {
    id: 'enrich-node',
    type: 'stage',
    position: { x: 300, y: 120 },
    data: {
      title: 'Enrich',
      description: 'PMF enriches hypo loan positions.',
      type: 'stage',
    } as WorkflowNodeData,
    parentId: 'main-workflow',
    extent: 'parent',
    style: { width: 200, height: 100 },
  },
  {
    id: 'staged-circle',
    type: 'circular',
    position: { x: 120, y: 240 },
    data: {
      label: 'staged',
    } as CircularNodeData,
    parentId: 'main-workflow',
    extent: 'parent',
  },
  {
    id: 'position-circle',
    type: 'circular',
    position: { x: 380, y: 240 },
    data: {
      label: 'position created',
    } as CircularNodeData,
    parentId: 'main-workflow',
    extent: 'parent',
  },
];

const initialEdges: Edge[] = [
  {
    id: 'stage-to-staged',
    source: 'stage-node',
    target: 'staged-circle',
    style: { stroke: 'hsl(var(--foreground))', strokeWidth: 2 },
    type: 'straight',
  },
  {
    id: 'enrich-to-position',
    source: 'enrich-node',
    target: 'position-circle',
    style: { stroke: 'hsl(var(--foreground))', strokeWidth: 2 },
    type: 'straight',
  },
  {
    id: 'staged-to-enrich',
    source: 'staged-circle',
    target: 'enrich-node',
    style: { stroke: 'hsl(var(--foreground))', strokeWidth: 2 },
    type: 'straight',
  },
];

const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="flex h-screen bg-workflow-bg">
      {/* Main Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-workflow-canvas"
          defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
        >
          <Background 
            color="hsl(var(--workflow-border))" 
            gap={25}
            size={1}
          />
          <Controls className="bg-workflow-node-bg border-workflow-border shadow-lg" />
          <MiniMap 
            className="bg-workflow-node-bg border-workflow-border shadow-lg"
            nodeColor="hsl(var(--workflow-border))"
            maskColor="hsl(var(--workflow-bg) / 0.9)"
          />
        </ReactFlow>
      </div>

      {/* Sidebar */}
      <WorkflowSidebar />
    </div>
  );
};

export default WorkflowBuilder;