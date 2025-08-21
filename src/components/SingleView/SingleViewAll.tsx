// ============================================================================
// SINGLE VIEW - CLEAN VERSION WITH PROPER IMPORTS
// ============================================================================
// All workflow components have been split into separate files.
// This file now only contains the VisualizationPage component and related hooks.

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockWorkflows } from '@/components/workflow/mock-data';
import type { WorkflowData } from '@/components/workflow/types';
import CollapsibleWorkflowSidebar from '@/components/workflow/CollapsibleWorkflowSidebar';
import SingleViewVisualization from '@/components/workflow/SingleViewVisualization';
import {
  Button,
  Typography,
  Container,
  Box,
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

// Backend integration hook
export function useWorkflowData(type: 'workflow' | 'entity' | null, id: string | null): WorkflowData | null {
  const [backendData, setBackendData] = useState<WorkflowData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch from backend
  const fetchWorkflowFromBackend = async (workflowId: string): Promise<WorkflowData | null> => {
    try {
      // TODO: Replace with actual backend API call
      // const response = await fetch(`/api/workflows/${workflowId}`);
      // const data = await response.json();
      // return data;
      
      // For now, simulate backend delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockWorkflows[workflowId] || null;
    } catch (err) {
      console.error('Failed to fetch workflow from backend:', err);
      return null;
    }
  };

  // Effect to load data when type/id changes
  useEffect(() => {
    if (!type || !id) {
      setBackendData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchWorkflowFromBackend(id)
      .then(data => {
        setBackendData(data);
        if (!data) {
          setError(`No ${type} found with id: ${id}`);
        }
      })
      .catch(err => {
        setError(err.message);
        setBackendData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [type, id]);

  return useMemo(() => {
    if (!type || !id) return null;
    
    // Return backend data if available, otherwise fallback to mock data
    return backendData || mockWorkflows[id] || null;
  }, [type, id, backendData]);
}

export function useAvailableOptions() {
  return useMemo(() => {
    // Convert mock workflows to selection options
    const workflowOptions = Object.entries(mockWorkflows).map(([id, data]) => ({
      id,
      title: data.workflow.title,
      description: data.workflow.description,
      category: 'workflow' as const,
    }));

    // For MVP, we only have workflows
    // In the future, add entity options here
    const entityOptions: any[] = [];

    return {
      workflows: workflowOptions,
      entities: entityOptions,
    };
  }, []);
}

// Hook to get available workflows for sidebar
export function useAvailableWorkflows() {
  return useMemo(() => {
    return Object.entries(mockWorkflows).map(([id, data]) => ({
      id,
      title: data.workflow.title,
      description: data.workflow.description,
    }));
  }, []);
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
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  
  // Default to first workflow if no URL params
  const workflowId = id || 'workflow-1';

  // Handle workflow switching from sidebar
  const handleWorkflowSelect = (workflowId: string) => {
    navigate(`/visualization/workflow/${workflowId}`);
  };

  return (
    <div className="h-screen flex bg-workflow-bg">
      {/* Collapsible Sidebar */}
      <CollapsibleWorkflowSidebar
        selectedWorkflow={workflowId}
        onWorkflowSelect={handleWorkflowSelect}
      />

      {/* Main Visualization Content */}
      <SingleViewVisualization workflowId={workflowId} />
    </div>
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