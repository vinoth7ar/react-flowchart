export interface IWorkflowResponseModel {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  status?: 'active' | 'inactive' | 'draft';
  createdBy?: string;
}

export interface IWorkflowStageResponseModel {
  id: string;
  workflowId: string;
  title: string;
  description: string;
  color?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IWorkflowStatusNodeResponseModel {
  id: string;
  workflowId: string;
  stageId?: string;
  label: string;
  color?: string;
  connectedToStage?: string;
  connectedToEntities?: string[];
  position?: {
    x: number;
    y: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface IWorkflowEntityResponseModel {
  id: string;
  workflowId: string;
  title: string;
  color?: string;
  type?: string;
  attributes?: Record<string, any>;
  position?: {
    x: number;
    y: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface IWorkflowDetailResponseModel extends IWorkflowResponseModel {
  stages: IWorkflowStageResponseModel[];
  statusNodes: IWorkflowStatusNodeResponseModel[];
  entities: IWorkflowEntityResponseModel[];
}

export interface IWorkflowListResponseModel {
  workflows: IWorkflowResponseModel[];
  totalCount: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IWorkflowSearchResponseModel {
  results: IWorkflowResponseModel[];
  totalResults: number;
  query: string;
  suggestions?: string[];
}