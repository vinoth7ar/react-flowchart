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

  // Fetch entity data by ID
  static async fetchEntity(entityId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/entities/${entityId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch entity: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching entity:', error);
      throw error;
    }
  }
}

// Example of expected backend response format:
/*
GET /api/workflows/hypo-loan-position

Response:
{
  "workflow": {
    "id": "hypo-loan-position",
    "title": "Hypo Loan Position",
    "description": "Workflow description"
  },
  "stages": [
    {
      "id": "stage1",
      "title": "Stage Title",
      "description": "Stage description",
      "color": "#color"
    }
  ],
  "statusNodes": [
    {
      "id": "status1",
      "label": "Status Label",
      "color": "#color",
      "connectedToStage": "stage1"
    }
  ],
  "entities": [
    {
      "id": "entity1",
      "title": "Entity Title",
      "color": "#color"
    }
  ]
}
*/