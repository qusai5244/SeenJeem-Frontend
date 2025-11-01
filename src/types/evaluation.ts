export type IEvaluationFrom = {
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
  type: string;
  publishedAt: string;
  closeAt: string;
  publish: string;
  language: string;
  totalResponses: number;
  trainerName?: string;
};

export type IEvaluationFormPagination = {
  items: IEvaluationFrom[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type IEvaluationFormResponse = {
  code: number;
  description: string;
  data: IEvaluationFormPagination;
  success: boolean;
};

export type IEvaluationSignleFormResponse = {
  code: number;
  description: string;
  data: IEvaluationFrom;
  success: boolean;
};

export type IEvaluationQuestion = {
  id: number;
  questionText: string;
  questionType: string;
  options?: string[];
};
