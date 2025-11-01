import type { SWRConfiguration } from 'swr';
import type { ICoursesData, IProductItem, ISingleCourseDataResponse } from 'src/types/product';
import { CONFIG } from 'src/global-config';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type CoursesData = {
  code: string;
  createdAt: string;
  createdBy: number;
  description: string;
  descriptionAr: string;
  id: number;
  name: string;
  nameAr: string;
  status: string;
  statusEnum: number;
  updatedAt: string;
  updatedBy: number;
  publish: string;
};

type CoursesDataPagination = {
  items: CoursesData[];
  page : number;
  pageSize : number;
  totalCount : number;
  totalPages : number;
}

type CoursesDataResponse = {
  code : number;
  description : string;
  data: CoursesDataPagination;
  success : boolean;
}


// type CourseDataResponse = {
//   code : number;
//   description : string;
//   data: null;
//   success : boolean;
// }

// export function useGetProducts(search = '', page = 1, pageSize = 10) {
//   const url = `${CONFIG.serverUrl}${CONFIG.courses.getCourses}?Search=${encodeURIComponent(search)}&Page=${page}&PageSize=${pageSize}`;
//   console.log('url', url);
//   const { data, isLoading, error, isValidating, mutate } = useSWR<CoursesDataResponse>(url, fetcher, swrOptions);

//   console.log('dataa', data);
//   const memoizedValue = useMemo(
//     () => ({
//       products: data?.data.items || [],
//       productsLoading: isLoading,
//       productsError: error,
//       productsValidating: isValidating,
//       productsEmpty: !isLoading && !isValidating && !data?.data.items.length,
//       totalCount: data?.data.totalCount || 0,
//       page: data?.data.page || 1,
//       pageSize: data?.data.pageSize || 10,
//       totalPages: data?.data.totalPages || 1,
//     }),
//     [data?.data.items, error, isLoading, isValidating, data?.data.totalCount, data?.data.page, data?.data.pageSize, data?.data.totalPages]
//   );
//   console.log('memoizedValue', memoizedValue);
//   return { ...memoizedValue, mutate };
// }

export function useDeleteProducts() {
  const url = endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR<CoursesDataResponse>(url, fetcher, swrOptions);

  console.log('dataa', data);
  const memoizedValue = useMemo(
    () => ({
      products: data?.data.items || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !isValidating && !data?.data.items.length,
    }),
    [data?.data.items, error, isLoading, isValidating]
  );
console.log('memoizedValue', memoizedValue);
  return memoizedValue;
}


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


export function useGetProduct(courseId: string) {
  const url = courseId ? [endpoints.product.details(courseId), null] : '';
  console.log("Product useGetProduct productId:", courseId);


  const { data, isLoading, error, isValidating } = useSWR<ISingleCourseDataResponse>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      course: data?.data,
      courseLoading: isLoading,
      courseError: error,
      courseValidating: isValidating,

    }),
    [data?.data, error, isLoading, isValidating]

  );
  console.log("Product useGetProduct ss:", data?.data);
  return memoizedValue;
}




export function useGetStatus() {
  const url = endpoints.status.list;
console.log('url', url);
  const { data, isLoading, error, isValidating } = useSWR<StatusDataResponse>(url, fetcher, swrOptions);

  console.log('dataa', data);
  const memoizedValue = useMemo(
    () => ({
      statusList: data?.data || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !isValidating && !data?.data,
    }),
    [data?.data, error, isLoading, isValidating]
  );
console.log('memoizedValue', memoizedValue);
  return memoizedValue;
}


// ----------------------------------------------------------------------

type SearchResultsData = {
  results: IProductItem[];
};

export function useSearchProducts(query: string) {
  const url = query ? [endpoints.product.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<SearchResultsData>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !isValidating && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}