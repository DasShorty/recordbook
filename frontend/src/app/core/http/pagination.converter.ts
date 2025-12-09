import {Pageable} from '@core/http/model/page.model';

export class PaginationConverter {

  static fromSkipTake(skip: number, take: number): Pageable {
    const page = Math.floor(skip / take);
    return {page: page, size: take};
  }

  static toSkipTake(page: number = 0, size: number = 20): { skip: number; take: number } {
    const skip = page * size;
    return {skip, take: size};
  }

  static getCurrentPage(skip: number, take: number): number {
    return Math.floor(skip / take);
  }

  static getTotalPages(totalElements: number, pageSize: number): number {
    return Math.ceil(totalElements / pageSize);
  }
}
