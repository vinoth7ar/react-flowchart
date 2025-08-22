export interface ICreateWorkflowRequestModel {
  title: string;
  description: string;
  status?: 'active' | 'inactive' | 'draft';
}

export interface IUpdateWorkflowRequestModel {
  title?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'draft';
}

export interface IWorkflowListRequestModel {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'draft' | 'all';
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface IWorkflowSearchRequestModel {
  query: string;
  limit?: number;
  filters?: {
    status?: 'active' | 'inactive' | 'draft';
    createdBy?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

export interface ICreateWorkflowStageRequestModel {
  workflowId: string;
  title: string;
  description: string;
  color?: string;
  order?: number;
}

export interface IUpdateWorkflowStageRequestModel {
  title?: string;
  description?: string;
  color?: string;
  order?: number;
}

export interface ICreateWorkflowEntityRequestModel {
  workflowId: string;
  title: string;
  color?: string;
  type?: string;
  attributes?: Record<string, any>;
  position?: {
    x: number;
    y: number;
  };
}

export interface IUpdateWorkflowEntityRequestModel {
  title?: string;
  color?: string;
  type?: string;
  attributes?: Record<string, any>;
  position?: {
    x: number;
    y: number;
  };
}