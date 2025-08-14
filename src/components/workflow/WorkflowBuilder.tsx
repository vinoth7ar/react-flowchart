import { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
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

// Mock data - this would come from backend
const mockWorkflowData = {
  workflow: {
    id: 'main-workflow',
    title: 'Hypo Loan Base Price',
    description: 'Workflow description',
  },
  stages: [
    {
      id: 'stage-node',
      title: 'Stage',
      description: 'Base price data staging.',
      position: { x: 50, y: 50 },
      color: 'gray',
    },
    {
      id: 'enrich-node', 
      title: 'Enrich',
      description: 'Enriching base price details.',
      position: { x: 400, y: 50 },
      color: 'gray',
    }
  ],
  statusNodes: [
    {
      id: 'base-staged-circle',
      label: 'base staged',
      position: { x: 125, y: 180 },
      color: 'gray',
    },
    {
      id: 'base-price-set-circle',
      label: 'base price set',
      position: { x: 475, y: 180 },
      color: 'gray',
    }
  ],
  entities: [
    {
      id: 'data-entity-1',
      title: 'Hypo Loan Position',
      color: 'gray',
    },
    {
      id: 'data-entity-2', 
      title: 'Loan Commitment',
      color: 'gray',
    },
    {
      id: 'data-entity-3',
      title: 'Hypo Loan Base Price',
      color: 'yellow',
    }
  ]
};

const createInitialNodes = (workflowData: typeof mockWorkflowData): Node[] => {
  const nodes: Node[] = [];

  // PMF Tag (outside workflow)
  nodes.push({
    id: 'pmf-tag',
    type: 'pmf-tag',
    position: { x: 50, y: 50 },
    data: {
      title: 'PMF',
      type: 'pmf-tag',
      onClick: () => console.log('PMF tag clicked'),
    } as WorkflowNodeData,
    draggable: true,
  });

  // Main workflow container
  nodes.push({
    id: workflowData.workflow.id,
    type: 'workflow',
    position: { x: 100, y: 100 },
    data: {
      title: workflowData.workflow.title,
      description: workflowData.workflow.description,
      type: 'workflow',
    } as WorkflowNodeData,
    style: { width: 700, height: 400 },
    draggable: true,
  });

  // Stage nodes
  workflowData.stages.forEach(stage => {
    nodes.push({
      id: stage.id,
      type: 'stage',
      position: stage.position,
      data: {
        title: stage.title,
        description: stage.description,
        type: 'stage',
        color: stage.color,
        onClick: () => console.log(`${stage.title} event clicked`),
      } as WorkflowNodeData,
      parentId: workflowData.workflow.id,
      extent: 'parent',
      style: { width: 250, height: 100 },
      draggable: true,
    });
  });

  // Status nodes (circular)
  workflowData.statusNodes.forEach(status => {
    nodes.push({
      id: status.id,
      type: 'circular',
      position: status.position,
      data: {
        label: status.label,
        color: status.color,
        onClick: () => console.log(`${status.label} status clicked`),
      } as CircularNodeData,
      parentId: workflowData.workflow.id,
      extent: 'parent',
      draggable: true,
    });
  });

  return nodes;
};

const initialNodes = createInitialNodes(mockWorkflowData);

const initialEdges: Edge[] = [
  {
    id: 'stage-to-staged',
    source: 'stage-node',
    target: 'base-staged-circle',
    style: { stroke: '#000', strokeWidth: 1 },
    type: 'smoothstep',
  },
  {
    id: 'enrich-to-set',
    source: 'enrich-node',
    target: 'base-price-set-circle',
    style: { stroke: '#000', strokeWidth: 1 },
    type: 'smoothstep',
  },
];

const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [entitiesExpanded, setEntitiesExpanded] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Create data entity nodes - always show them
  const createEntityNodes = (): Node[] => {
    const entityNodes: Node[] = [];

    mockWorkflowData.entities.forEach((entity, index) => {
      const x = 50 + index * 200;
      const y = 320;

      entityNodes.push({
        id: entity.id,
        type: 'data',
        position: { x, y },
        data: {
          title: entity.title,
          type: 'data',
          color: entity.color,
          isSelected: selectedEntity === entity.id,
          onClick: () => setSelectedEntity(selectedEntity === entity.id ? null : entity.id),
        } as WorkflowNodeData,
        parentId: mockWorkflowData.workflow.id,
        extent: 'parent' as const,
        draggable: true,
      });
    });

    return entityNodes;
  };

  // Combine all nodes
  const allNodes = [
    ...initialNodes,
    ...createEntityNodes(),
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Canvas */}
      <div className="flex-1 p-6">
        <ReactFlow
          nodes={allNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-100"
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
        >
          <Background 
            color="#d1d5db" 
            gap={20}
            size={1}
          />
          <Controls className="bg-white border border-gray-300 shadow-lg" />
        </ReactFlow>
      </div>

      {/* Sidebar */}
      <WorkflowSidebar />
    </div>
  );
};

export default WorkflowBuilder;