import {inject, Injectable, resource, Resource, ResourceRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AdvancedUserBody, PasswordUserBody} from '@shared/users/users.model';
import {firstValueFrom} from 'rxjs';
import {QueryResult} from '@shared/http/http.model';

@Injectable({providedIn: 'root'})
export class UserService {
  private readonly httpClient = inject(HttpClient);

  getUsers = (
    offset: number,
    limit: number,
    companyId?: string
  ): ResourceRef<QueryResult<AdvancedUserBody[]> | undefined> => {
    return resource({
      loader: () => {

        let url = 'users?offset=' + offset + '&limit=' + limit;

        if (companyId)
          url += '&companyId=' + companyId;

        return firstValueFrom(this.httpClient.get<QueryResult<AdvancedUserBody[]>>(url, {
          withCredentials: true
        }));
      }
    });
  };

  getUser = (id: string): Resource<AdvancedUserBody | undefined> => {
    return resource({
      loader: () => {

        return firstValueFrom(this.httpClient.get<AdvancedUserBody>('users?id' + id, {
          withCredentials: true
        }));

      }
    });
  };

  createUser = (body: PasswordUserBody): Resource<AdvancedUserBody | undefined> => {
    return resource({
      loader: () => {
        return firstValueFrom(this.httpClient.post<AdvancedUserBody>('users', body, {
          withCredentials: true
        }));
      }
    });
  };

  deleteUser = (id: string): Resource<void> => {
    return resource({
      loader: () => {
        return firstValueFrom(this.httpClient.delete<void>(`users/${id}`, {
          withCredentials: true
        }))
      }
    });
  };
}
