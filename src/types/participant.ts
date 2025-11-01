
// ----------------------------------------------------------------------


export type IParticipantTableFilters = {
  stock: string[];
  publish: string[];
};

export type IParticipantData = {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  status: string;
  statusEnum: number;
  createdAt: string;
  updatedAt: string;
  publish: string;

};

export type IParticipantDataPagination = {
  items: IParticipantData[];
  page : number;
  pageSize : number;
  totalCount : number;
  totalPages : number;
}

export type IParticipantDataResponse = {
  code : number;
  description : string;
  data : IParticipantDataPagination;
  success : boolean;
}











