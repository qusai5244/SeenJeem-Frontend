import type {AxiosRequestConfig } from 'axios';

import axios from 'axios';
import { mutate } from 'swr';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });


axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default axiosInstance;


// ----------------------------------------------------------------------


export const baseURL = CONFIG.serverUrl;
const token = localStorage.getItem('jwt_access_token');

export type ApiResponse<T> = {
  data: T | null;
  success: boolean;
  code: number;
  description: string;
}

type Pagination<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export enum ApiRequestType {
  Get = 1,
  Post = 2,
  Put = 3,
  Delete = 4
}

export const apiFetcher = async <T>(
  url: string,
  apiType: ApiRequestType,
  params?: Record<string, string | number>,
  data?: any, 
  config: object = {}
): Promise<ApiResponse<T>> => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...config, // Merge any additional headers
    };

    let response;

    if (params && apiType === ApiRequestType.Get) {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      url += (url.includes('?') ? '&' : '?') + query;
    }

    switch (apiType) {
      case ApiRequestType.Get:
        response = await axios.get(`${baseURL}${url}`, { headers });
        break;
      case ApiRequestType.Post:
        response = await axios.post(`${baseURL}${url}`, data, { headers });
        break;
      case ApiRequestType.Put:
        response = await axios.put(`${baseURL}${url}`, data, { headers });
        break;
      case ApiRequestType.Delete:
        response = await axios.delete(`${baseURL}${url}`, { 
          headers,
          data: data // Send data in request body for DELETE
        });
        break;
      default:
        throw new Error(`Invalid API request type: ${apiType}`);
    }

    console.log("sss",response.data)
    
    // Check if the response is successful
    if (!response.data.success) {
      console.error("API Request Failed:", response.data.description);
      throw new Error(response.data.description || "API Request Failed");
    }
    
    return response.data; // Ensure it matches `ApiResponse<T>`

  } catch (error: any) {
    console.error("API Request Failed:", error);
    throw new Error(error.response?.data?.description || error.response?.data?.message || "API Request Failed");
  }
};

// ----------------------------------------------------------------------

// export const mediaFetcher = async (
//   files: File[],
//   mediaType: string
// ): Promise<ApiResponse<number[]>> => {
//   try {
//     const headers = {
//       Authorization: `Bearer ${token}`,
//       // Don't set Content-Type for FormData, let the browser set it with boundary
//     };

//     const formData = new FormData();
    
//     // Append each file to the FormData
//     files.forEach((file, index) => {
//       formData.append('files', file);
//     });
    
//     // Append the media type
//     formData.append('mediaType', mediaType);

//     // const response = await axios.post(
//     //   `${baseURL}${CONFIG.media.add(mediaType)}`,
//     //   formData,
//     //   { headers }
//     // );

//     console.log("Media upload response:", response.data);
    
//     // Check if the response is successful
//     if (!response.data.success) {
//       console.error("Media Upload Failed:", response.data.description);
//       throw new Error(response.data.description || "Media Upload Failed");
//     }
    
//     return response.data; // Returns ApiResponse<number[]>

//   } catch (error: any) {
//     console.error("Media Upload Failed:", error);
//     throw new Error(error.response?.data?.description || error.response?.data?.message || "Media Upload Failed");
//   }
// };





// ----------------------------------------------------------------------














export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];
    const res = await axiosInstance.get(url, { ...config });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: { me: '/api/profile', signIn: '/api/auth/login', signUp: '/api/merchant/auth/register' },
  mail: { list: '/api/mail/list', details: '/api/mail/details', labels: '/api/mail/labels' },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    create: '/api/merchant/courses',
    edit: (id: string) => `/api/merchant/courses/${id}`,
    list: '/api/merchant/courses',
    delete: '/api/merchant/courses',
    details: (id: string) => `/api/merchant/courses/${id}`,
    search: '/api/product/search',
  },
  evaluation : {
    create: '/api/merchant/evaluationForms',
    list: '/api/merchant/evaluationForms',
    details: (id: string) => `/api/merchant/evaluationForms/${id}`,
    edit: (id: string) => `/api/merchant/evaluationForms/${id}`,
    delete: '/api/merchant/evaluationForms',
  },
  question: {
    create: (id: string) => `/api/merchant/EvaluationForms/${id}/questions`,
    listOptions:`/api/merchant/optionTemplates`,
    list:(id: string) => `/api/merchant/EvaluationForms/${id}/questions`,
    search:(id: string) =>`/api/merchant/EvaluationForms/${id}/questions`,
    edit:(evaluationId: string,questionId:string) =>`/api/merchant/EvaluationForms/${evaluationId}/questions/${questionId}`,
    delete:(evaluationId: string,questionId:string) => `/api/merchant/EvaluationForms/${evaluationId}/questions/${questionId}`,
    details:(evaluationId: string,questionId:string) =>`/api/merchant/EvaluationForms/${evaluationId}/questions/${questionId}`,
    changeOrder: `/api/merchant/EvaluationForms/questions/changeOrder`

  },
  participant : {
    create: `/api/merchant/courses/participants`,
    edit:(courseId: string,participantId:string) =>`/api/merchant/courses/${courseId}/participants/${participantId}`,
  },
  status:  {
    list: '/api/public/Lookups',

  }

};















