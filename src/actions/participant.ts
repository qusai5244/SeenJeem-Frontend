import type { SWRConfiguration } from 'swr';
import { CONFIG } from 'src/global-config';

import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher } from 'src/lib/axios';
import type { IParticipantData, IParticipantDataResponse } from 'src/types/participant';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

type SingleParticipantDataResponse = {
  code: number;
  description: string;
  data: IParticipantData;
  success: boolean;
};


// export function useGetParticipants(courseId: string, search = '', page = 1, pageSize = 10) {
//   const url = courseId
//     ? `${CONFIG.serverUrl}${CONFIG.participants.getParticipants(courseId)}?Search=${encodeURIComponent(search)}&Page=${page}&PageSize=${pageSize}`
//     : null;
//   const { data, isLoading, error, isValidating  } = useSWR<IParticipantDataResponse>(url, fetcher, swrOptions);

//   const memoizedValue = useMemo(
//     () => ({
//       participants: data?.data.items || [],
//       participantsLoading: isLoading,
//       participantsError: error,
//       participantsValidating: isValidating,
//       participantsEmpty: !isLoading && !isValidating && !data?.data.items.length,
//       totalCount: data?.data.totalCount || 0,
//       page: data?.data.page || 1,
//       pageSize: data?.data.pageSize || 10,
//       totalPages: data?.data.totalPages || 1,
//     }),
//     [data?.data.items, error, isLoading, isValidating, data?.data.totalCount, data?.data.page, data?.data.pageSize, data?.data.totalPages]
//   );
//   return { ...memoizedValue, mutate };
// }


// export function useGetParticipant(courseId: string, participantId: string) {
//   const url = courseId && participantId ? CONFIG.serverUrl + CONFIG.participants.getParticipant(courseId,participantId) : null;
//   const { data, isLoading, error, isValidating } = useSWR<SingleParticipantDataResponse>(url, fetcher, swrOptions);

//   const memoizedValue = useMemo(
//     () => ({
//       participant: data?.data,
//       participantLoading: isLoading,
//       participantError: error,
//       participantValidating: isValidating,
//       participantEmpty: !isLoading && !isValidating && !data?.data,
//     }),
//     [data?.data, error, isLoading, isValidating]
//   );

//   return { ...memoizedValue, mutate };
// }
