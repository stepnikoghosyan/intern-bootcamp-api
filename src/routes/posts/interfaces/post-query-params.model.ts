import { IPaginationQueryParams } from '../../../shared/interfaces/pagination-query-params.model';

export interface IPostQueryParams extends IPaginationQueryParams {
  userID?: number;
  name?: string;
}
