// ============================================================================
// SINGLE VIEW - CLEAN VERSION WITH PROPER IMPORTS
// ============================================================================
// All workflow components have been split into separate files.
// This file now only contains the VisualizationPage component and related hooks.

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WorkflowBuilder from '@/components/workflow/WorkflowBuilder';
import { useWorkflowData as useWorkflowService } from '@/hooks/useWorkflowData';
import type { WorkflowData } from '@/components/workflow/types';
import {
  Button,
  Typography,
  Chip,
  Switch,
  FormControlLabel,
  Container,
  Box,
  Paper,
  AppBar,
  Toolbar,
  Stack
} from '@mui/material';
import {
  Visibility,
  Settings,
  ArrowForward
} from '@mui/icons-material';

// ============================================================================
// TYPES SECTION
// ============================================================================

export interface SelectionState {
  selectedType: 'workflow' | 'entity' | null;
  selectedId: string | null;
  customizations: ViewCustomizations;
}

export interface ViewCustomizations {
  expandAllEntities: boolean;
  showLegend: boolean;
  showMiniMap: boolean;
}

export interface WorkflowOption {
  id: string;
  title: string;
  description: string;
  category: 'workflow' | 'entity';
}

// ============================================================================
// HOOKS SECTION
// ============================================================================

// Backend integration hook - Updated to use new service layer
export function useWorkflowData(type: 'workflow' | 'entity' | null, id: string | null): WorkflowData | null {
  const [backendData, setBackendData] = useState<WorkflowData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the new service layer
  const { selectedWorkflow, availableWorkflows } = useWorkflowService(id);

  // Effect to update backend data when service data changes
  useEffect(() => {
    if (!type || !id) {
      setBackendData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate backend delay for compatibility
    const timer = setTimeout(() => {
      if (selectedWorkflow) {
        setBackendData(selectedWorkflow);
        setError(null);
      } else {
        setError(`No ${type} found with id: ${id}`);
        setBackendData(null);
      }
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [type, id, selectedWorkflow]);

  return useMemo(() => {
    if (!type || !id) return null;
    return backendData;
  }, [type, id, backendData]);
}

export function useAvailableOptions() {
  const { availableWorkflows } = useWorkflowService();
  
  return useMemo(() => {
    // Use service layer data
    const workflowOptions = availableWorkflows.map(workflow => ({
      id: workflow.id,
      title: workflow.title,
      description: workflow.description,
      category: 'workflow' as const,
    }));

    // For MVP, we only have workflows
    // In the future, add entity options here
    const entityOptions: any[] = [];

    return {
      workflows: workflowOptions,
      entities: entityOptions,
    };
  }, [availableWorkflows]);
}

// Hook to get available workflows for sidebar
export function useAvailableWorkflows() {
  const { availableWorkflows } = useWorkflowService();
  
  return useMemo(() => {
    return availableWorkflows.map(workflow => ({
      id: workflow.id,
      title: workflow.title,
      description: workflow.description,
    }));
  }, [availableWorkflows]);
}

// ============================================================================
// API SERVICE SECTION
// ============================================================================

// Backend API service for workflow data
export class WorkflowAPI {
  private static baseURL = '/api'; // Configure your backend URL
  
  // Fetch workflow data by ID
  static async fetchWorkflow(workflowId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/workflows/${workflowId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workflow: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate that the response matches our WorkflowData interface
      if (!data.workflow || !data.stages || !data.statusNodes || !data.entities) {
        throw new Error('Invalid workflow data format from backend');
      }

      return data;
    } catch (error) {
      console.error('Error fetching workflow:', error);
      throw error;
    }
  }

  // Fetch all available workflows
  static async fetchAvailableWorkflows(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseURL}/workflows`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workflows: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching available workflows:', error);
      throw error;
    }
  }
}

// ============================================================================
// VISUALIZATION PAGE COMPONENT
// ============================================================================

export function VisualizationPage() {
  console.log('VisualizationPage component starting...');
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  
  // Default to first workflow if no URL params
  const workflowId = id || 'workflow-1';
  const availableWorkflows = useAvailableWorkflows();
  
  // Get workflow data - use service layer instead of mock data
  const workflowData = useWorkflowData(
    'workflow', 
    workflowId
  );

  // Handle workflow switching from sidebar
  const handleWorkflowSelect = (workflowId: string) => {
    navigate(`/visualization/workflow/${workflowId}`);
  };

  // Display the workflow visualization directly
  const displayWorkflowId = workflowId;

  if (!workflowData) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Workflow Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The workflow "{displayWorkflowId}" could not be loaded
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Enhanced Header */}
      <AppBar position="static" color="transparent" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Workflow Visualization - {workflowData.workflow.title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Workflow Visualization */}
      <Box sx={{ flexGrow: 1 }}>
        <WorkflowBuilder 
          selectedWorkflowId={displayWorkflowId}
          workflowData={workflowData}
          onWorkflowSelect={handleWorkflowSelect}
        />
      </Box>
    </Box>
  );
}

// ============================================================================
// LANDING PAGE COMPONENT
// ============================================================================

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" fontWeight="bold" sx={{ mb: 2 }}>
              Pipeline Management Framework
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Visualize and manage your workflows and entities with our intuitive single-view system
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 6 }}>
              <Button 
                variant="contained"
                size="large"
                startIcon={<Visibility />}
                endIcon={<ArrowForward />}
                onClick={() => navigate('/selection')}
              >
                Start Visualization
              </Button>
              
              <Button 
                variant="outlined"
                size="large"
                startIcon={<Settings />}
                onClick={() => navigate('/selection')}
              >
                Configure & Select
              </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Choose from available workflows and entities • Customize your view • 
              Visualize with interactive React Flow
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}