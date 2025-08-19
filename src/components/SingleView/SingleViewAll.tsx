// ============================================================================
// SINGLE VIEW - ALL IN ONE FILE (Material UI Version - Fixed)
// ============================================================================
// This file contains the complete SingleView functionality using only Material UI components.
// It can be split into separate files later using the comment sections below.

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Container,
  Box,
  Paper,
  Grid,
  IconButton,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Stack
} from '@mui/material';
import {
  Visibility,
  ArrowBack,
  Settings,
  ArrowForward
} from '@mui/icons-material';
import { mockWorkflows } from '@/components/workflow/mock-data';
import { WorkflowData, LayoutConfig } from '@/components/workflow/types';
import WorkflowBuilder from '@/components/workflow/WorkflowBuilder';

// ============================================================================
// TYPES SECTION - Move to: src/components/SingleView/types.ts
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
// CONTEXT SECTION - Move to: src/components/SingleView/context/SelectionContext.tsx
// ============================================================================

interface SelectionContextType {
  selection: SelectionState;
  updateSelection: (type: 'workflow' | 'entity', id: string) => void;
  updateCustomizations: (customizations: Partial<ViewCustomizations>) => void;
  clearSelection: () => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

const defaultCustomizations: ViewCustomizations = {
  expandAllEntities: true,
  showLegend: true,
  showMiniMap: true,
};

const defaultSelection: SelectionState = {
  selectedType: null,
  selectedId: null,
  customizations: defaultCustomizations,
};

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<SelectionState>(defaultSelection);

  const updateSelection = (type: 'workflow' | 'entity', id: string) => {
    setSelection(prev => ({
      ...prev,
      selectedType: type,
      selectedId: id,
    }));
  };

  const updateCustomizations = (customizations: Partial<ViewCustomizations>) => {
    setSelection(prev => ({
      ...prev,
      customizations: { ...prev.customizations, ...customizations },
    }));
  };

  const clearSelection = () => {
    setSelection(defaultSelection);
  };

  return (
    <SelectionContext.Provider value={{
      selection,
      updateSelection,
      updateCustomizations,
      clearSelection,
    }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}

// ============================================================================
// HOOKS SECTION - Move to: src/components/SingleView/hooks/useWorkflowData.ts
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
// API SERVICE SECTION - Move to: src/components/SingleView/services/WorkflowAPI.ts
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
// WORKFLOW SELECTOR COMPONENT - Move to: src/components/SingleView/components/WorkflowSelector.tsx
// ============================================================================

interface WorkflowSelectorProps {
  workflows: WorkflowOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function WorkflowSelector({ workflows, selectedId, onSelect }: WorkflowSelectorProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Workflows
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose up to one workflow to visualize (MVP)
      </Typography>
      
      <Stack spacing={2}>
        {workflows.map((workflow) => (
          <Paper
            key={workflow.id}
            sx={{
              p: 2,
              cursor: 'pointer',
              border: selectedId === workflow.id ? 2 : 1,
              borderColor: selectedId === workflow.id ? 'primary.main' : 'divider',
              '&:hover': {
                boxShadow: 2,
                borderColor: 'text.secondary'
              }
            }}
            onClick={() => onSelect(workflow.id)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {workflow.title}
              </Typography>
              <Box 
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: 2,
                  borderColor: selectedId === workflow.id ? 'primary.main' : 'text.disabled',
                  backgroundColor: selectedId === workflow.id ? 'primary.main' : 'transparent'
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {workflow.description}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

// ============================================================================
// ENTITY SELECTOR COMPONENT - Move to: src/components/SingleView/components/EntitySelector.tsx
// ============================================================================

interface EntitySelectorProps {
  entities: WorkflowOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function EntitySelector({ entities, selectedId, onSelect }: EntitySelectorProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Entities
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose up to one entity to visualize (MVP)
      </Typography>
      
      {entities.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', border: '2px dashed', borderColor: 'divider' }}>
          <Chip label="Coming Soon" color="secondary" sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Entity visualization will be available in a future release
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {entities.map((entity) => (
            <Paper
              key={entity.id}
              sx={{
                p: 2,
                cursor: 'pointer',
                border: selectedId === entity.id ? 2 : 1,
                borderColor: selectedId === entity.id ? 'primary.main' : 'divider',
                '&:hover': {
                  boxShadow: 2,
                  borderColor: 'text.secondary'
                }
              }}
              onClick={() => onSelect(entity.id)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {entity.title}
                </Typography>
                <Box 
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: 2,
                    borderColor: selectedId === entity.id ? 'primary.main' : 'text.disabled',
                    backgroundColor: selectedId === entity.id ? 'primary.main' : 'transparent'
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {entity.description}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}

// ============================================================================
// CUSTOMIZATION PANEL COMPONENT - Move to: src/components/SingleView/components/CustomizationPanel.tsx
// ============================================================================

interface CustomizationPanelProps {
  customizations: ViewCustomizations;
  onUpdate: (customizations: Partial<ViewCustomizations>) => void;
}

function CustomizationPanel({ customizations, onUpdate }: CustomizationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <Typography variant="h6">Customize View</Typography>
        <Typography variant="body2" color="text.secondary">
          Configure how the workflow visualization will appear
        </Typography>
      </CardHeader>
      <CardContent>
        <Stack spacing={3}>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={customizations.expandAllEntities}
                  onChange={(e) => onUpdate({ expandAllEntities: e.target.checked })}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Expand All Entities
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Show all entity details by default
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={customizations.showLegend}
                  onChange={(e) => onUpdate({ showLegend: e.target.checked })}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Show Legend
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Display legend panel in the visualization
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={customizations.showMiniMap}
                  onChange={(e) => onUpdate({ showMiniMap: e.target.checked })}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Show Mini Map
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Display navigation mini map
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Custom TabPanel component for Material UI Tabs
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// ============================================================================
// SELECTION PAGE COMPONENT - Move to: src/components/SingleView/SelectionPage.tsx
// ============================================================================

export function SelectionPage() {
  const navigate = useNavigate();
  const { selection, updateSelection, updateCustomizations } = useSelection();
  const { workflows, entities } = useAvailableOptions();
  const [activeTab, setActiveTab] = useState(0);

  const handleWorkflowSelect = (id: string) => {
    updateSelection('workflow', id);
    setActiveTab(0);
  };

  const handleEntitySelect = (id: string) => {
    updateSelection('entity', id);
    setActiveTab(1);
  };

  const handleVisualize = () => {
    if (selection.selectedType && selection.selectedId) {
      navigate(`/visualization/${selection.selectedType}/${selection.selectedId}`);
    }
  };

  const canVisualize = selection.selectedType && selection.selectedId;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={1}>
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              Pipeline Management Framework
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select a workflow or entity to visualize
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Visibility />}
            onClick={handleVisualize}
            disabled={!canVisualize}
            size="large"
          >
            Visualize
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Selection Panel */}
          <Box sx={{ flex: '1 1 66%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label={`Workflows (${workflows.length})`} />
                <Tab label={`Entities (${entities.length})`} />
              </Tabs>
            </Box>
            
            <TabPanel value={activeTab} index={0}>
              <WorkflowSelector
                workflows={workflows}
                selectedId={selection.selectedType === 'workflow' ? selection.selectedId : null}
                onSelect={handleWorkflowSelect}
              />
            </TabPanel>
            
            <TabPanel value={activeTab} index={1}>
              <EntitySelector
                entities={entities}
                selectedId={selection.selectedType === 'entity' ? selection.selectedId : null}
                onSelect={handleEntitySelect}
              />
            </TabPanel>
          </Box>

          {/* Customization Panel */}
          <Box sx={{ flex: '1 1 33%' }}>
            <Box sx={{ position: 'sticky', top: 32 }}>
              <CustomizationPanel
                customizations={selection.customizations}
                onUpdate={updateCustomizations}
              />
              
              {/* Selection Summary */}
              {canVisualize && (
                <Paper sx={{ mt: 3, p: 2, bgcolor: 'primary.50', border: 1, borderColor: 'primary.200' }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Selected for Visualization:
                  </Typography>
                  <Typography variant="body2">
                    <Box component="span" sx={{ textTransform: 'capitalize' }}>
                      {selection.selectedType}:
                    </Box>{' '}
                    {selection.selectedType === 'workflow' 
                      ? workflows.find(w => w.id === selection.selectedId)?.title
                      : entities.find(e => e.id === selection.selectedId)?.title
                    }
                  </Typography>
                </Paper>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// ============================================================================
// VISUALIZATION PAGE COMPONENT - Move to: src/components/SingleView/VisualizationPage.tsx
// ============================================================================

export function VisualizationPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { selection, updateSelection } = useSelection();
  const availableWorkflows = useAvailableWorkflows();
  
  // Get workflow data based on URL params (handles backend integration)
  const workflowData = useWorkflowData(
    (type === 'workflow' || type === 'entity') ? type : null, 
    id || null
  );

  // Handle workflow switching from sidebar
  const handleWorkflowSelect = (workflowId: string) => {
    navigate(`/visualization/workflow/${workflowId}`);
  };

  // Sync URL params with selection context
  useEffect(() => {
    if (type && id && (type === 'workflow' || type === 'entity')) {
      if (selection.selectedType !== type || selection.selectedId !== id) {
        updateSelection(type, id);
      }
    }
  }, [type, id, selection.selectedType, selection.selectedId, updateSelection]);

  // Handle missing data
  if (!type || !id) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Invalid URL
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please select a workflow or entity to visualize
          </Typography>
          <Button variant="contained" onClick={() => navigate('/selection')}>
            Go to Selection
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!workflowData) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            {type === 'workflow' ? 'Workflow' : 'Entity'} Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The {type} "{id}" could not be loaded
          </Typography>
          <Button variant="contained" onClick={() => navigate('/selection')}>
            Back to Selection
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Enhanced Header with Navigation */}
      <AppBar position="static" color="transparent" elevation={1}>
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/selection')}
            sx={{ mr: 2 }}
          >
            Back to Selection
          </Button>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {workflowData.workflow.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {type === 'workflow' ? 'Workflow' : 'Entity'} Visualization
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => navigate('/selection')}
          >
            Change Selection
          </Button>
        </Toolbar>
      </AppBar>

      {/* Workflow Visualization */}
      <Box sx={{ flexGrow: 1 }}>
        <WorkflowBuilder 
          selectedWorkflowId={id || undefined}
          workflowData={workflowData || undefined}
          onWorkflowSelect={handleWorkflowSelect}
        />
      </Box>
    </Box>
  );
}

// ============================================================================
// LANDING PAGE COMPONENT - Move to: src/pages/Index.tsx (or keep in main pages folder)
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

// ============================================================================
// MAIN EXPORTS - Move to: src/components/SingleView/index.tsx
// ============================================================================

// Functions and components are already exported inline above
// No need for duplicate exports here
