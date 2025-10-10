import {inject, Injectable, resource, Resource, ResourceRef} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {AdvancedUserBody, PasswordUserBody} from '@shared/users/users.model';
import {HttpService} from '@shared/http/http.service';

@Injectable({providedIn: 'root'})
export class UserService {
  private readonly http = inject(HttpService);

  getUsers = (
    offset: number,
    limit: number,
    companyId?: string
  ): ResourceRef<Response | undefined> => {

    let params = new HttpParams().set('offset', offset).set('limit', limit);

    if (companyId)
      params = params.set('company', companyId);

    return resource({
      params: () => (params),
      loader: ({params}) => {

        let url = 'users?offset=' + params.get("offset") + '&limit=' + params.get("limit");

        if (params.has("companyId"))
          url += '&companyId=' + params.get("companyId");

        return this.http.fetch(url, {
          headers: {
            accept: "application/json"
          }
        });
      }
    });
  };

  getUser = (id: string): Resource<AdvancedUserBody> => {
    return resource({
      load: () => this.http.get<AdvancedUserBody>(`/users/${id}`)
    });
  };

  createUser = (body: PasswordUserBody): Resource<AdvancedUserBody> => {
    return resource({
      load: () => this.http.post<AdvancedUserBody>('/users', body)
    });
  };

  deleteUser = (id: string): Resource<void> => {
    return resource({
      load: () => this.http.delete<void>(`/users/${id}`)
    });
  };
}
