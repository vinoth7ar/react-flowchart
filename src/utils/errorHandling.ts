// Simplified error handling utilities

export interface IErrorMessageModel {
  message: string;
  code?: string;
  details?: any;
}

export interface IDialogContextModel {
  handleError: (message: string) => void;
}

export interface IIsErrorContextModel {
  setIsError: (error: boolean) => void;
}

export interface IAuthContextModel {
  setIsUserLoggedIn: (loggedIn: boolean) => void;
}

export interface IRequestModel {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: any;
  responseType?: 'json' | 'blob' | 'text' | 'stream';
  headers?: Record<string, string>;
}

// Mock axios error interface for compatibility
export interface MockAxiosError extends Error {
  isAxiosError?: boolean;
  response?: {
    data: any;
    status: number;
    statusText: string;
  };
}

export const isAxiosError = (error: any): error is MockAxiosError => {
  return error && (error.isAxiosError === true || error.response !== undefined);
};

export const handleError = (
  dialogContext: IDialogContextModel,
  isErrorContext: IIsErrorContextModel,
  errorMessage: string
) => {
  console.error('Error:', errorMessage);
  // In production, you would call the actual context methods
  // dialogContext.handleError(errorMessage);
  // isErrorContext.setIsError(true);
};

export const handlePamError = (
  dialogContext: IDialogContextModel,
  isErrorContext: IIsErrorContextModel,
  message: string
) => {
  console.error('PAM Error:', message);
  // In production, you would call the actual context methods
  // dialogContext.handleError(message);
  // isErrorContext.setIsError(true);
};

export const getWorkflowConfig = (searchText: string): IRequestModel => ({
  method: 'GET',
  url: `/api/workflows/search?q=${encodeURIComponent(searchText)}`,
  responseType: 'json',
});

export const getWorkflowDetailConfig = (workflowId: string): IRequestModel => ({
  method: 'GET',
  url: `/api/workflows/${workflowId}`,
  responseType: 'json',
});

export const getWorkflowListConfig = (params: any): IRequestModel => ({
  method: 'GET',
  url: '/api/workflows',
  params: params,
  responseType: 'json',
});

export const getSearchResponseModel = (config: IRequestModel) => config;