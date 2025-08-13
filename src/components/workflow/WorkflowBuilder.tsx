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
    title: 'Commitment',
    description: '',
  },
  stages: [
    {
      id: 'create-node',
      title: 'Create',
      description: 'Seller enters commitment details in contract takeout screen. 5 hypo loans are created with base prices.',
      position: { x: 50, y: 50 },
      color: 'green',
    },
    {
      id: 'accept-node', 
      title: 'Accept',
      description: '',
      position: { x: 400, y: 50 },
      color: 'blue',
    }
  ],
  statusNodes: [
    {
      id: 'created-circle',
      label: 'created',
      position: { x: 150, y: 150 },
      color: 'green',
    },
    {
      id: 'accepted-circle',
      label: 'accepted',
      position: { x: 450, y: 150 },
      color: 'gray',
    }
  ],
  entities: [
    {
      id: 'data-entity-1',
      title: 'Loan Commitment',
      color: 'yellow',
    },
    {
      id: 'data-entity-2', 
      title: 'Hypo Loan Position',
      color: 'white',
    },
    {
      id: 'data-entity-3',
      title: 'Hypo Loan Base Price',
      color: 'white',
    }
  ]
};

const createInitialNodes = (workflowData: typeof mockWorkflowData): Node[] => {
  const nodes: Node[] = [];

  // LSA Tag (outside workflow)
  nodes.push({
    id: 'lsa-tag',
    type: 'pmf-tag',
    position: { x: 50, y: 50 },
    data: {
      title: 'LSA',
      type: 'pmf-tag',
      onClick: () => console.log('LSA tag clicked'),
    } as WorkflowNodeData,
    draggable: false,
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
    style: { width: 600, height: 350 },
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
      style: { width: 250, height: 120 },
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
    });
  });

  return nodes;
};

const initialNodes = createInitialNodes(mockWorkflowData);

const initialEdges: Edge[] = [
  {
    id: 'create-to-created',
    source: 'create-node',
    target: 'created-circle',
    style: { stroke: '#000', strokeWidth: 2 },
    type: 'straight',
  },
  {
    id: 'accept-to-accepted',
    source: 'accept-node',
    target: 'accepted-circle',
    style: { stroke: '#000', strokeWidth: 2 },
    type: 'straight',
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

  // Create data entity nodes dynamically based on expansion state
  const createEntityNodes = (): Node[] => {
    if (!entitiesExpanded) return [];
    
    const entityNodes: Node[] = [];
    const entitiesPerRow = 3;
    const entityWidth = 160;
    const entitySpacing = 20;
    const startX = 80;
    const startY = 280;

    mockWorkflowData.entities.forEach((entity, index) => {
      const x = 50 + index * 180;
      const y = 250;

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

  // Update main workflow node with expand/collapse button
  const workflowNodeWithButton: Node = {
    ...initialNodes.find(n => n.id === mockWorkflowData.workflow.id)!,
    data: {
      ...initialNodes.find(n => n.id === mockWorkflowData.workflow.id)!.data,
      entitiesExpanded,
      onToggleEntities: () => setEntitiesExpanded(!entitiesExpanded),
    }
  };

  // Combine all nodes
  const allNodes = [
    ...initialNodes.filter(n => n.id !== mockWorkflowData.workflow.id),
    workflowNodeWithButton,
    ...createEntityNodes(),
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={allNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-white"
          defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
        >
          <Background 
            color="#e5e7eb" 
            gap={25}
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