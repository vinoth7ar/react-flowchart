import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import type { Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import WorkflowNode from './WorkflowNode';
import CircularNode from './CircularNode';
import WorkflowSidebar from './WorkflowSidebar';
import { useWorkflowData } from '../../hooks/useWorkflowData';
import { WorkflowData } from './types';
import { createDynamicNodes, defaultLayoutConfig } from './layout-utils';
import { updateConnectionsForWorkflow } from './connection-utils';

interface WorkflowBuilderProps {
  layoutConfig?: typeof defaultLayoutConfig;
  selectedWorkflowId?: string;
  workflowData?: WorkflowData;
  onWorkflowSelect?: (workflowId: string) => void;
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
  workflowData: externalWorkflowData,
  onWorkflowSelect: externalOnWorkflowSelect
}: WorkflowBuilderProps = {}) => {
  const [entitiesExpanded, setEntitiesExpanded] = useState(false);
  
  // Use the new service layer to get workflow data
  const { selectedWorkflow, availableWorkflows, isLoading } = useWorkflowData(externalWorkflowId);
  
  // Get current workflow data - prefer external data, fallback to service data
  const currentWorkflowData = externalWorkflowData || selectedWorkflow;
  
  // Create initial nodes and edges dynamically
  const initialNodes = currentWorkflowData ? createDynamicNodes(
    currentWorkflowData, 
    entitiesExpanded, 
    () => setEntitiesExpanded(!entitiesExpanded),
    layoutConfig
  ) : [];
  const initialEdges = currentWorkflowData ? updateConnectionsForWorkflow(currentWorkflowData) : [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle workflow selection
  const handleWorkflowSelect = (workflowId: string) => {
    if (externalOnWorkflowSelect) {
      // Use external handler (for SingleView navigation)
      externalOnWorkflowSelect(workflowId);
    } else {
      // Use internal state (for standalone usage)
      const workflowExists = availableWorkflows.some(w => w.id === workflowId);
      if (workflowExists) {
        setEntitiesExpanded(false);
      }
    }
  };

  // Update nodes when entities expansion state changes or workflow changes
  useEffect(() => {
    if (currentWorkflowData) {
      const updatedNodes = createDynamicNodes(
        currentWorkflowData,
        entitiesExpanded,
        () => setEntitiesExpanded(!entitiesExpanded),
        layoutConfig
      );
      setNodes(updatedNodes);
    }
  }, [entitiesExpanded, currentWorkflowData, layoutConfig, setNodes]);

  // Update connections when workflow data changes
  useEffect(() => {
    if (currentWorkflowData) {
      const updatedEdges = updateConnectionsForWorkflow(currentWorkflowData);
      setEdges(updatedEdges);
    }
  }, [currentWorkflowData, setEdges]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-workflow-bg items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading workflow...</p>
        </div>
      </div>
    );
  }

  if (!currentWorkflowData) {
    return (
      <div className="flex h-screen w-full bg-workflow-bg items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No workflow data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-workflow-bg">
      {/* Main Canvas */}
      <div className="flex-1 h-full p-2">
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
            color="#d1d5db" 
            gap={16}
            size={1}
          />
          <Controls className="bg-white border border-gray-300 shadow-lg" />
        </ReactFlow>
      </div>

      {/* Sidebar */}
      <WorkflowSidebar 
        selectedWorkflow={externalWorkflowId || 'hypo-loan-position'}
        onWorkflowSelect={handleWorkflowSelect}
        availableWorkflows={availableWorkflows}
      />
    </div>
  );
};

export default WorkflowBuilder;