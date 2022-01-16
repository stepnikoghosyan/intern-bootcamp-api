export interface IPaginationResponse<T = any> {
  count: number;
  results: Array<T>;
}
