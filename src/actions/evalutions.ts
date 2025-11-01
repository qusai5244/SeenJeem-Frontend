import type { SWRConfiguration } from "swr";

import  type { IEvaluationFormResponse, IEvaluationSignleFormResponse } from "src/types/evaluation";

import useSWR from "swr";
import { useMemo } from "react";

import { endpoints, fetcher } from "src/lib/axios";



const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};



export function useGetEvaluations() {
  const url = endpoints.evaluation.list;
console.log('url', url);
  const { data, isLoading, error, isValidating } = useSWR<IEvaluationFormResponse>(url, fetcher, swrOptions);

  console.log('dataa', data);
  const memoizedValue = useMemo(
    () => ({
      evaluation: data?.data.items || [],
      evaluationLoading: isLoading,
      evaluationError: error,
      evaluationValidating: isValidating,
      evaluationEmpty: !isLoading && !isValidating && !data?.data.items.length,
    }),
    [data?.data.items, error, isLoading, isValidating]

  );
  console.log('data Evaltuiation', data);

console.log('memoizedValueEvaltuiation', memoizedValue);
  return memoizedValue;
}



export function useGetEvaluation(evaluationId: string) {
  const url = evaluationId
  ? [endpoints.evaluation.details(evaluationId), { params: { evaluationId } }]
  : '';

  const { data, isLoading, error, isValidating } = useSWR<IEvaluationSignleFormResponse>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      evaluation: data?.data,
      evaluationLoading: isLoading,
      evaluationError: error,
      evaluationValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  console.log('data single Evaltuiation', data);


  return memoizedValue;
}



