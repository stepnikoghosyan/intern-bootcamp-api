import { IPaginationQueryParams } from '../../../shared/interfaces/pagination-query-params.model';

export interface ICommentQueryParams extends IPaginationQueryParams {
  posts: number[];
}
