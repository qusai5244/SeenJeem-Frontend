import type { SWRConfiguration } from 'swr';
import type { ICoursesData, ISingleCourseDataResponse } from 'src/types/product';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from 'src/lib/axios';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------



type StatusData = {
  key: string;
  value: number;
};

type StatusDataResponse = {
  code: number;
  description: string;
  data: {
    enumName: string;
    data: StatusData[];
  }[];
  success: boolean;
};

// SingleCourseDataResponse type is now imported from src/types/product

// ----------------------------------------------------------------------




export function useGetLookUp() {
  // const url = endpoints.status.list;
  const url = `${CONFIG.serverUrl}/api/public/Lookups`;

  const { data, isLoading, error, isValidating } = useSWR<StatusDataResponse>(url, fetcher, swrOptions);

  console.log('dataa', data);
  const memoizedValue = useMemo(
    () => ({
      lookupList: data?.data || [],
     lookupLoading: isLoading,
     lookupError: error,
     lookupValidating: isValidating,
     lookupEmpty: !isLoading && !isValidating && !data?.data,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  return memoizedValue;
}


// ----------------------------------------------------------------------





