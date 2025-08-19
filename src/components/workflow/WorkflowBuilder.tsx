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
import { WorkflowData } from './types';
import { createDynamicNodes, defaultLayoutConfig } from './layout-utils';
import { updateConnectionsForWorkflow } from './connection-utils';

const nodeTypes = {
  workflow: WorkflowNode,
  circular: CircularNode,
  stage: WorkflowNode,
  data: WorkflowNode,
  'pmf-tag': WorkflowNode,
  'entities-group': WorkflowNode,
};

// Mock data - this would come from backend/props
const mockWorkflowData: WorkflowData = {
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
      connectedToStage: 'stage-node',
      connectedToEntities: ['data-entity-1'],
    },
    {
      id: 'position-created-circle',
      label: 'position created',
      color: 'gray',
      connectedToStage: 'enrich-node',
      connectedToEntities: ['data-entity-1'],
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

interface WorkflowBuilderProps {
  workflowData?: WorkflowData;
  layoutConfig?: typeof defaultLayoutConfig;
}

const WorkflowBuilder = ({ 
  workflowData = mockWorkflowData,
  layoutConfig = defaultLayoutConfig 
}: WorkflowBuilderProps = {}) => {
  const [entitiesExpanded, setEntitiesExpanded] = useState(false);
  
  // Create initial nodes and edges dynamically
  const initialNodes = createDynamicNodes(
    workflowData, 
    entitiesExpanded, 
    () => setEntitiesExpanded(!entitiesExpanded),
    layoutConfig
  );
  const initialEdges = updateConnectionsForWorkflow(workflowData);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Update nodes when entities expansion state changes
  useEffect(() => {
    const updatedNodes = createDynamicNodes(
      workflowData,
      entitiesExpanded,
      () => setEntitiesExpanded(!entitiesExpanded),
      layoutConfig
    );
    setNodes(updatedNodes);
  }, [entitiesExpanded, workflowData, layoutConfig, setNodes]);

  // Update connections when workflow data changes
  useEffect(() => {
    const updatedEdges = updateConnectionsForWorkflow(workflowData, edges);
    setEdges(updatedEdges);
  }, [workflowData]); // Only depend on workflowData to avoid infinite loop

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