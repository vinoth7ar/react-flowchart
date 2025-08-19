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
import { mockWorkflows, defaultWorkflow } from './mock-data';
import { WorkflowData } from './types';
import { createDynamicNodes, defaultLayoutConfig } from './layout-utils';
import { updateConnectionsForWorkflow } from './connection-utils';

interface WorkflowBuilderProps {
  layoutConfig?: typeof defaultLayoutConfig;
  selectedWorkflowId?: string;
  workflowData?: WorkflowData;
}

const nodeTypes = {
  workflow: WorkflowNode,
  circular: CircularNode,
  stage: WorkflowNode,
  data: WorkflowNode,
  'pmf-tag': WorkflowNode,
  'entities-group': WorkflowNode,
};

const WorkflowBuilder = ({ 
  layoutConfig = defaultLayoutConfig,
  selectedWorkflowId: externalWorkflowId,
  workflowData: externalWorkflowData
}: WorkflowBuilderProps = {}) => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(externalWorkflowId || defaultWorkflow);
  const [entitiesExpanded, setEntitiesExpanded] = useState(false);
  
  // Get current workflow data - prefer external data, fallback to mock data
  const currentWorkflowData = externalWorkflowData || 
                              mockWorkflows[selectedWorkflowId] || 
                              mockWorkflows[defaultWorkflow];
  
  // Create initial nodes and edges dynamically
  const initialNodes = createDynamicNodes(
    currentWorkflowData, 
    entitiesExpanded, 
    () => setEntitiesExpanded(!entitiesExpanded),
    layoutConfig
  );
  const initialEdges = updateConnectionsForWorkflow(currentWorkflowData);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle workflow selection
  const handleWorkflowSelect = (workflowId: string) => {
    if (mockWorkflows[workflowId]) {
      setSelectedWorkflowId(workflowId);
      setEntitiesExpanded(false); // Reset entities expansion when switching workflows
    }
  };

  // Update nodes when entities expansion state changes or workflow changes
  useEffect(() => {
    const updatedNodes = createDynamicNodes(
      currentWorkflowData,
      entitiesExpanded,
      () => setEntitiesExpanded(!entitiesExpanded),
      layoutConfig
    );
    setNodes(updatedNodes);
  }, [entitiesExpanded, currentWorkflowData, layoutConfig, setNodes]);

  // Update connections when workflow data changes
  useEffect(() => {
    const updatedEdges = updateConnectionsForWorkflow(currentWorkflowData);
    setEdges(updatedEdges);
  }, [currentWorkflowData, setEdges]);

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
      <WorkflowSidebar 
        selectedWorkflow={selectedWorkflowId}
        onWorkflowSelect={handleWorkflowSelect}
      />
    </div>
  );
};

export default WorkflowBuilder;