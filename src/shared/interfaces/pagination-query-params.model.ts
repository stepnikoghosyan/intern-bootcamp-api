import { IQueryParams } from './query-params.model';

export interface IPaginationQueryParams extends IQueryParams {
  page?: number;
  pageSize?: number;
}
