import { useCallback, useState, useEffect } from 'react';
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
  'entities-group': WorkflowNode,
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
      description: 'PLMF stages commitment data in PMF database.',
      color: 'gray',
    },
    {
      id: 'enrich-node', 
      title: 'Enrich',
      description: 'PMF enriches hypo loan positions.',
      color: 'gray',
    }
  ],
  statusNodes: [
    {
      id: 'staged-circle',
      label: 'staged',
      color: 'gray',
    },
    {
      id: 'position-created-circle',
      label: 'position created',
      color: 'gray',
    }
  ],
  entities: [
    {
      id: 'data-entity-1',
      title: 'Hypo Loan Position',
      color: 'yellow',
    },
    {
      id: 'data-entity-2', 
      title: 'Loan Commitment',
      color: 'gray',
    },
    {
      id: 'data-entity-3',
      title: 'Hypo Loan Base Price',
      color: 'gray',
    }
  ]
};

const createInitialNodes = (workflowData: typeof mockWorkflowData): Node[] => {
  const nodes: Node[] = [];

  // Layout constants
  const workflowWidth = 800;
  const workflowHeight = 450;
  const stageWidth = 220;
  const stageHeight = 90;
  const circleSize = 64;
  
  // Calculate dynamic positions
  const stageSpacing = (workflowWidth - (2 * stageWidth) - 60) / 1; // Space between stages
  const stageY = 70;
  const circleY = stageY + stageHeight + 40;
  const entitiesY = circleY + circleSize + 40;

  // PMF Tag (outside workflow)
  nodes.push({
    id: 'pmf-tag',
    type: 'pmf-tag',
    position: { x: 20, y: 20 },
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
    position: { x: 20, y: 60 },
    data: {
      title: workflowData.workflow.title,
      description: workflowData.workflow.description,
      type: 'workflow',
    } as WorkflowNodeData,
    style: { width: workflowWidth, height: workflowHeight },
    draggable: true,
  });

  // Stage nodes - positioned dynamically
  workflowData.stages.forEach((stage, index) => {
    const stageX = 30 + (index * (stageWidth + stageSpacing));
    
    nodes.push({
      id: stage.id,
      type: 'stage',
      position: { x: stageX, y: stageY },
      data: {
        title: stage.title,
        description: stage.description,
        type: 'stage',
        color: stage.color,
        onClick: () => console.log(`${stage.title} event clicked`),
      } as WorkflowNodeData,
      parentId: workflowData.workflow.id,
      extent: 'parent',
      style: { width: stageWidth, height: stageHeight },
      draggable: true,
    });
  });

  // Status nodes (circular) - positioned below stages
  workflowData.statusNodes.forEach((status, index) => {
    const circleX = 30 + (index * (stageWidth + stageSpacing)) + (stageWidth / 2) - (circleSize / 2);
    
    nodes.push({
      id: status.id,
      type: 'circular',
      position: { x: circleX, y: circleY },
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
    target: 'staged-circle',
    style: { stroke: '#000', strokeWidth: 1 },
    type: 'smoothstep',
  },
  {
    id: 'enrich-to-created',
    source: 'enrich-node',
    target: 'position-created-circle',
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

  // Initialize grouped entities node once
  useEffect(() => {
    const entitiesGroupNode: Node = {
      id: 'entities-group',
      type: 'entities-group',
      position: { x: 30, y: 320 },
      data: {
        title: 'Data Entities',
        type: 'entities-group',
        entities: mockWorkflowData.entities,
        entitiesExpanded: entitiesExpanded,
        onToggleEntities: () => setEntitiesExpanded(!entitiesExpanded),
        onClick: () => console.log('Entities group clicked'),
      } as WorkflowNodeData,
      parentId: mockWorkflowData.workflow.id,
      extent: 'parent' as const,
      draggable: true,
    };

    setNodes((currentNodes) => {
      const filteredNodes = currentNodes.filter(n => n.id !== 'entities-group');
      return [...filteredNodes, entitiesGroupNode];
    });
  }, [setNodes, entitiesExpanded]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Canvas */}
      <div className="flex-1 p-2">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-100"
          defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
        >
          <Background 
            color="#d1d5db" 
            gap={16}
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