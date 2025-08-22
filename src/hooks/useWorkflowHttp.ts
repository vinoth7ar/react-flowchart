import { useCallback } from 'react';
import useCustomQuery from './useCustomQuery';
import { 
  IWorkflowDetailResponseModel, 
  IWorkflowListResponseModel,
  IWorkflowSearchResponseModel 
} from '../models/responses/workflow/IWorkflowResponseModel';
import { queryKeys } from '../constants/queryKeys';
import { queryAction, handleQueryError } from '../services/queryFns/workflowQueryFns';
import { getWorkflowConfig, getWorkflowDetailConfig, getWorkflowListConfig, getSearchResponseModel } from '../utils/errorHandling';
import { IWorkflowListRequestModel } from '../models/requests/workflow/IWorkflowRequestModel';

function useWorkflowHttp(searchText: string) {
  const selectData = useCallback((data: IWorkflowSearchResponseModel) => {
    return JSON.parse(JSON.stringify(data));
  }, []);

  return useCustomQuery<IWorkflowSearchResponseModel>({
    queryKey: queryKeys.workflows.search(searchText),
    queryFn: () => 
      queryAction<IWorkflowSearchResponseModel>(getSearchResponseModel(getWorkflowConfig(searchText))),
    enabled: Boolean(searchText),
    staleTime: 600000, // 10 min
    cacheTime: 900000, // 15 min
    select: selectData,
  });
}

function useWorkflowDetail(workflowId: string) {
  const selectData = useCallback((data: IWorkflowDetailResponseModel) => {
    return JSON.parse(JSON.stringify(data));
  }, []);

  return useCustomQuery<IWorkflowDetailResponseModel>({
    queryKey: queryKeys.workflows.detail(workflowId),
    queryFn: () => 
      queryAction<IWorkflowDetailResponseModel>(getSearchResponseModel(getWorkflowDetailConfig(workflowId))),
    enabled: Boolean(workflowId),
    staleTime: 300000, // 5 min
    cacheTime: 600000, // 10 min
    select: selectData,
  });
}

function useWorkflowList(params: IWorkflowListRequestModel = {}) {
  const selectData = useCallback((data: IWorkflowListResponseModel) => {
    return JSON.parse(JSON.stringify(data));
  }, []);

  return useCustomQuery<IWorkflowListResponseModel>({
    queryKey: queryKeys.workflows.list(JSON.stringify(params)),
    queryFn: () => 
      queryAction<IWorkflowListResponseModel>(getWorkflowListConfig(params)),
    staleTime: 300000, // 5 min
    cacheTime: 600000, // 10 min
    select: selectData,
  });
}

export { useWorkflowHttp, useWorkflowDetail, useWorkflowList };
export default useWorkflowHttp;