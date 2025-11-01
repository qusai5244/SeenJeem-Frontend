export type OptionTemplateOption = {
  name: string;
  nameAr: string;
  scale: number;
}

export type OptionTemplateData ={
  id: number;
  calculationType: string;
  style: string;
  options: OptionTemplateOption[];
}


export type OptionTemplateDataResponse = {
  code : number;
  description : string;
  data: OptionTemplateData[]
  success : boolean;
}




export type OptionTamplete = {
  option: string;
  scale: number;
}



export interface IQuestion {
  id: string;
  title: string;
  type: string;
  order: number;
  isRequired: boolean;
  createdById: number;
  createdBy: string;
  subQuestions: string[];
  isApplicableToUpdate:boolean;
  optionsTemplate:OptionTamplete[];
  options:string[];
  optionsTemplateId:number;
  publish:string;
  hints?: {
    type: number;
    hint: string;
  }[];
  minimumSelectedAnswersId?: number;
  maximumSelectedAnswersId?: number;
}

export type IQuestionFilters = {
  type: string;
};

export type QuestionDataPagination = {
  items: IQuestion[];
  page : number;
  pageSize : number;
  totalCount : number;
  totalPages : number;
}

export type QuestionDataResponse = {
  code : number;
  description : string;
  data: QuestionDataPagination;
  success : boolean;
}












