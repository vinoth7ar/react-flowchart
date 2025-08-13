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
  'pmf-tag': WorkflowNode,
};

const initialNodes: Node[] = [
  // PMF Tag positioned outside the main workflow
  {
    id: 'pmf-tag',
    type: 'pmf-tag',
    position: { x: 80, y: 80 },
    data: {
      title: 'PMF',
      type: 'pmf-tag',
      onClick: () => console.log('PMF tag clicked'),
    } as WorkflowNodeData,
    draggable: false,
  },
  // Main workflow container
  {
    id: 'main-workflow',
    type: 'workflow',
    position: { x: 100, y: 120 },
    data: {
      title: 'Hypo Loan Position',
      description: 'Workflow description',
      type: 'workflow',
    } as WorkflowNodeData,
    style: { width: 650, height: 480 },
  },
  // Stage node inside workflow
  {
    id: 'stage-node',
    type: 'stage',
    position: { x: 50, y: 140 },
    data: {
      title: 'Stage',
      description: 'FLUME stages commitment data in PMF database',
      type: 'stage',
      onClick: () => console.log('Stage event clicked'),
    } as WorkflowNodeData,
    parentId: 'main-workflow',
    extent: 'parent',
    style: { width: 220, height: 110 },
  },
  // Enrich node inside workflow
  {
    id: 'enrich-node',
    type: 'stage',
    position: { x: 350, y: 140 },
    data: {
      title: 'Enrich',
      description: 'PMF enriches hypo loan positions.',
      type: 'stage',
      onClick: () => console.log('Enrich event clicked'),
    } as WorkflowNodeData,
    parentId: 'main-workflow',
    extent: 'parent',
    style: { width: 220, height: 110 },
  },
  // Status nodes (circular)
  {
    id: 'staged-circle',
    type: 'circular',
    position: { x: 140, y: 270 },
    data: {
      label: 'staged',
      onClick: () => console.log('Staged status clicked'),
    } as CircularNodeData,
    parentId: 'main-workflow',
    extent: 'parent',
  },
  {
    id: 'position-circle',
    type: 'circular',
    position: { x: 440, y: 270 },
    data: {
      label: 'position created',
      onClick: () => console.log('Position created status clicked'),
    } as CircularNodeData,
    parentId: 'main-workflow',
    extent: 'parent',
  },
  // Data entity nodes
  {
    id: 'data-entity-1',
    type: 'data',
    position: { x: 70, y: 380 },
    data: {
      title: 'Hypo Loan Position',
      type: 'data',
      onClick: () => console.log('Hypo Loan Position data entity clicked'),
    } as WorkflowNodeData,
    parentId: 'main-workflow',
    extent: 'parent',
  },
  {
    id: 'data-entity-2',
    type: 'data',
    position: { x: 280, y: 380 },
    data: {
      title: 'Loan Commitment',
      type: 'data',
      onClick: () => console.log('Loan Commitment data entity clicked'),
    } as WorkflowNodeData,
    parentId: 'main-workflow',
    extent: 'parent',
  },
  {
    id: 'data-entity-3',
    type: 'data',
    position: { x: 70, y: 430 },
    data: {
      title: 'Hypo Loan Base Price',
      type: 'data',
      onClick: () => console.log('Hypo Loan Base Price data entity clicked'),
    } as WorkflowNodeData,
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