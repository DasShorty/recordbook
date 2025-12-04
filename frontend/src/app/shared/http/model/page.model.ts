export type Page<T> = {
  content: Array<T>;
  page: PageableObject;
}

export type PageableObject = {
  size: number,
  number: number,
  totalElements: number,
  totalPages: number
};
