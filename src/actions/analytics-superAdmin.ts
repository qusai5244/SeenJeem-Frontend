import type { SWRConfiguration } from 'swr';
import { CONFIG } from 'src/global-config';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type AnalyticsData = {
  totalOrganizations: number;
  totalEvaluationForms: number;
  totalQuizzes: number;
  totalUsers: number;
  topCoursesParticipants: { key: string; value: string }[];
  topEvaluatiionFormResponders: { key: string; value: string }[];
  topQuizzesSubmittion: { key: string; value: string }[];
  evaluationFormsPerMonth: number[];
  quizzesPerMonth: number[];
};

type AnalyticsResponse = {
  success: boolean;
  code: number;
  description: string;
  data: AnalyticsData;
};

// ----------------------------------------------------------------------

export function useGetAnalytics() {
  const url = `${CONFIG.serverUrl}${CONFIG.superAdmin.analytics.getHomePage}`;

  const { data, isLoading, error, isValidating } = useSWR<AnalyticsResponse>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      analytics: data?.data,
      analyticsLoading: isLoading,
      analyticsError: error,
      analyticsValidating: isValidating,
      analyticsEmpty: !isLoading && !isValidating && !data?.data,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
} 