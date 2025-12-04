export type QueryResult<T> = {
  total: number,
  page: number,
  size: number,
  content: T
}
