import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Optional} from '@shared/datamapping/optional';

@Injectable({providedIn: 'root'})
export class OptionalResponseInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse && this.isJsonResponse(event)) {
          const transformedBody = this.replaceNullsWithOptional(event.body);
          return event.clone({body: transformedBody});
        }
        return event;
      })
    );
  }

  private isJsonResponse(event: HttpResponse<any>): boolean {
    const contentType = event.headers.get('Content-Type');
    return contentType !== null && contentType.includes("application/json");
  }

  private replaceNullsWithOptional(value: any): any {
    if (value === null) {
      return Optional.empty();
    }

    if (Array.isArray(value)) {
      return value.map(item => this.replaceNullsWithOptional(item));
    }

    if (typeof value === 'object') {
      const newObj: any = {};
      for (const [key, val] of Object.entries(value)) {
        newObj[key] = this.replaceNullsWithOptional(val);
      }
      return newObj;
    }

    return value;
  }

}
