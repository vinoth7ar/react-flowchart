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
    title: 'Hypo Loan Position',
    description: 'Workflow description',
  },
  stages: [
    {
      id: 'stage-node',
      title: 'Stage',
      description: 'FLUME stages commitment data in PMF database',
      position: { x: 80, y: 80 },
    },
    {
      id: 'enrich-node', 
      title: 'Enrich',
      description: 'PMF enriches hypo loan positions.',
      position: { x: 380, y: 80 },
    }
  ],
  statusNodes: [
    {
      id: 'staged-circle',
      label: 'staged',
      position: { x: 155, y: 180 },
    },
    {
      id: 'position-circle',
      label: 'position created',
      position: { x: 455, y: 180 },
    }
  ],
  entities: [
    {
      id: 'data-entity-1',
      title: 'Hypo Loan Position',
    },
    {
      id: 'data-entity-2', 
      title: 'Loan Commitment',
    },
    {
      id: 'data-entity-3',
      title: 'Hypo Loan Base Price',
    },
    {
      id: 'data-entity-4',
      title: 'Interest Rate',
    },
    {
      id: 'data-entity-5',
      title: 'Customer Profile',
    }
  ]
};

const createInitialNodes = (workflowData: typeof mockWorkflowData): Node[] => {
  const nodes: Node[] = [];

  // PMF Tag
  nodes.push({
    id: 'pmf-tag',
    type: 'pmf-tag',
    position: { x: 80, y: 80 },
    data: {
      title: 'PMF',
      type: 'pmf-tag',
      onClick: () => console.log('PMF tag clicked'),
    } as WorkflowNodeData,
    draggable: false,
  });

  // Main workflow container
  nodes.push({
    id: workflowData.workflow.id,
    type: 'workflow',
    position: { x: 100, y: 120 },
    data: {
      title: workflowData.workflow.title,
      description: workflowData.workflow.description,
      type: 'workflow',
    } as WorkflowNodeData,
    style: { width: 650, height: 480 },
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
        onClick: () => console.log(`${stage.title} event clicked`),
      } as WorkflowNodeData,
      parentId: workflowData.workflow.id,
      extent: 'parent',
      style: { width: 200, height: 80 },
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
    id: 'stage-to-staged',
    source: 'stage-node',
    target: 'staged-circle',
    style: { stroke: '#000', strokeWidth: 2 },
    type: 'straight',
  },
  {
    id: 'enrich-to-position',
    source: 'enrich-node',
    target: 'position-circle',
    style: { stroke: '#000', strokeWidth: 2 },
    type: 'straight',
  },
  {
    id: 'staged-to-enrich',
    source: 'staged-circle',
    target: 'enrich-node',
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
      const row = Math.floor(index / entitiesPerRow);
      const col = index % entitiesPerRow;
      const x = startX + col * (entityWidth + entitySpacing);
      const y = startY + row * 60;

      entityNodes.push({
        id: entity.id,
        type: 'data',
        position: { x, y },
        data: {
          title: entity.title,
          type: 'data',
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