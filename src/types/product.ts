import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IProductFilters = {
  rating: string;
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
};

export type IProductTableFilters = {
  stock: string[];
  publish: string[];
};

export type IProductReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  postedAt: IDateValue;
  isPurchased: boolean;
  attachments?: string[];
};

export type IProductItem = {
  id: string;
  sku: string;
  name: string;
  code: string;
  price: number;
  taxes: number;
  tags: string[];
  sizes: string[];
  publish: string;
  gender: string[];
  coverUrl: string;
  images: string[];
  colors: string[];
  quantity: number;
  category: string;
  available: number;
  totalSold: number;
  description: string;
  totalRatings: number;
  totalReviews: number;
  createdAt: IDateValue;
  inventoryType: string;
  subDescription: string;
  priceSale: number | null;
  reviews: IProductReview[];
  newLabel: {
    content: string;
    enabled: boolean;
  };
  saleLabel: {
    content: string;
    enabled: boolean;
  };
  ratings: {
    name: string;
    starCount: number;
    reviewCount: number;
  }[];
};


export type ICoursesData = {
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
  evaluationForms?: Array<{ name: string }>;
  quizzes?: Array<{ name: string }>;
  number?: string;
  type?: string | null;
  deliveringDate?: string;
  accomplishingDate?: string;
  actualDeliveringDate?: string;
  actualAccomplishingDate?: string;
  goals?: string[];
  topics?: string[];
  trainers?: Array<{ name: string; email: string }>;
  trainees?: Array<{ name: string; email: string }>;
};

export type ICoursesDataPagination = {
  items: ICoursesData[];
  page : number;
  pageSize : number;
  totalCount : number;
  totalPages : number;
}

export type ICoursesDataResponse = {
  code : number;
  description : string;
  data : ICoursesDataPagination;
  success : boolean;
}

export type ISingleCourseDataResponse = {
  code: number;
  description: string;
  data: ICoursesData;
  success: boolean;
}











