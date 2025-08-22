import { addDays, subDays } from 'date-fns';
import { 
  IWorkflowDetailResponseModel, 
  IWorkflowListResponseModel,
  IWorkflowSearchResponseModel 
} from '../models/responses/workflow/IWorkflowResponseModel';
import { formatISODateTimeToString, formatISODateToString } from '../utils/dateUtils';

// Snackbar context interface
interface ISnackbarContextModel {
  handleLeftDraft: (value: boolean) => void;
  handleSnackbarOpen: (value: boolean) => void;
  handleApproveSnackbar: (value: boolean) => void;
}

let breadCrumbPath = '';

const getWeekEnding = (date: Date | string, addedDays: number) => {
  const baseDate = typeof date === 'string' ? new Date(date) : date;
  const endOfWeekValue = addDays(baseDate, addedDays);
  return formatISODateToString(endOfWeekValue.toISOString());
};

const getWeekStart = (
  date: string,
  subtractedDays: number,
  displayEOM: boolean
) => {
  const baseDate = new Date(date);
  const subDate = subDays(baseDate, subtractedDays);
  
  if (displayEOM) {
    return formatISODateTimeToString(subDate.toISOString());
  } else {
    return formatISODateToString(subDate.toISOString()).padStart(2, '0');
  }
};

const handleDraftSnackbar = (snackbarContext: ISnackbarContextModel) => {
  snackbarContext.handleLeftDraft(true);
  snackbarContext.handleSnackbarOpen(true);
};

const handleApproveSnackbar = (
  snackbarContext: ISnackbarContextModel
) => {
  snackbarContext.handleApproveSnackbar(true);
};

// Workflow-specific utility functions
const transformWorkflowData = (data: IWorkflowDetailResponseModel) => {
  return {
    ...data,
    stages: data.stages?.sort((a, b) => (a.order || 0) - (b.order || 0)) || [],
    entities: data.entities?.map(entity => ({
      ...entity,
      position: entity.position || { x: 0, y: 0 },
    })) || [],
  };
};

const validateWorkflowData = (data: any): boolean => {
  return !!(data && data.id && data.title);
};

export {
  getWeekEnding,
  getWeekStart,
  handleDraftSnackbar,
  handleApproveSnackbar,
  transformWorkflowData,
  validateWorkflowData,
  breadCrumbPath,
};