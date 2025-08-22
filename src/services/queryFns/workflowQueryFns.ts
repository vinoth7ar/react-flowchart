import instance from '../axiosInstance';
import { 
  IWorkflowDetailResponseModel, 
  IWorkflowListResponseModel,
  IWorkflowSearchResponseModel 
} from '../../models/responses/workflow/IWorkflowResponseModel';
import { 
  IRequestModel,
  IDialogContextModel,
  IIsErrorContextModel,
  IAuthContextModel,
  IErrorMessageModel,
  MockAxiosError,
  isAxiosError,
  handleError,
  handlePamError
} from '../../utils/errorHandling';

const queryAction = async <T>(requestConfig: IRequestModel): Promise<T> => {
  const response = await instance.request({
    method: requestConfig.method || 'GET',
    url: requestConfig.url,
    data: requestConfig.data || null,
    params: requestConfig.params || null,
    headers: requestConfig.headers,
  });
  return response.data;
};

const queryFileAction = async (requestConfig: IRequestModel) => {
  const response = await instance.request({
    method: requestConfig.method || 'GET',
    url: requestConfig.url,
    data: requestConfig.data || null,
    params: requestConfig.params || null,
    headers: requestConfig.headers,
  });
  return response;
};

const handleQueryError = (
  error: unknown,
  dialogContext: IDialogContextModel,
  isErrorContext: IIsErrorContextModel,
  authContext: IAuthContextModel,
  customErrorMsg?: string
) => {
  let errorMessage = '';
  const storageKey = 'expiration';
  
  if (customErrorMsg) {
    handleError(dialogContext, isErrorContext, customErrorMsg);
  } else {
    if (isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
      switch (error.response?.status) {
        case 401:
          if (error.response?.data?.['www-authenticate']) {
            authContext.setIsUserLoggedIn(false);
            localStorage.removeItem(storageKey);
            return window.location.reload();
          } else {
            // TODO Add Key Chain Link
            errorMessage = 'Entitlements Missing';
          }
          break;
        case 503:
          errorMessage = 'Server is Unavailable at this time';
          break;
        // More Status Codes and functionality can be placed here
        default:
          break;
      }
      handleError(dialogContext, isErrorContext, errorMessage);
    } else {
      handleError(dialogContext, isErrorContext, 'Unknown Error');
    }
  }
};

const handlePAMutationError = (
  error: unknown,
  dialogContext: IDialogContextModel,
  isErrorContext: IIsErrorContextModel
) => {
  const axiosError = error as MockAxiosError;
  const errorResponse = axiosError.response?.data;
  const { message } = (errorResponse as IErrorMessageModel) || { message: 'Unknown error' };
  handlePamError(dialogContext, isErrorContext, message);
};

export {
  handlePAMutationError,
  handleQueryError,
  queryAction,
  queryFileAction,
};