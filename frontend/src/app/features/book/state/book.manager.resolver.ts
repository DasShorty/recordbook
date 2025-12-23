import {ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router, RouterStateSnapshot} from '@angular/router';
import {Book} from '@features/book/models/book.model';
import {inject} from '@angular/core';
import {BookStore} from '@features/book/state/book.store';
import {catchError, map, of} from 'rxjs';

export const bookManagerIdResolver: ResolveFn<Book> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const bookStore = inject(BookStore);
  const router = inject(Router);
  const bookId = route.paramMap.get('bookId')!;
  const cachedBook = bookStore.books().filter(book => book.id === bookId).pop();

  console.log("Resolving book with id:", bookId, "Cached book:", cachedBook);

  if (cachedBook) {
    return of(cachedBook);
  }

  return bookStore.loadBookById(bookId)
    .pipe(
      map(book => {
        if (!book) {
          return new RedirectCommand(router.parseUrl("/record-book/manage"));
        }
        console.log("Resolved book from server:", book);
        return book;
      }),
      catchError(() => {
        return [new RedirectCommand(router.parseUrl("/record-book/manage"))];
      })
    )
};
