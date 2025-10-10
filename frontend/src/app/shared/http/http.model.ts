export type QueryResult<T> = {
  total: number,
  limit: number,
  offset: number,
  data: T
}
