import { IPaginationQueryParams } from 'src/shared/interfaces/pagination-query-params.model';

export interface IUsersQueryParams extends IPaginationQueryParams {
  excludeSelf?: boolean | string | number;
  search?: string;
}
