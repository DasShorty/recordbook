import {AbstractControl, AsyncValidator, ValidationErrors} from '@angular/forms';
import {inject, Injectable} from '@angular/core';
import {debounceTime, distinctUntilChanged, map, Observable, of, switchMap, take} from 'rxjs';
import {CompanyStore} from '@shared/company/company.store';

@Injectable({providedIn: 'root'})
export class CompanyFormValidator implements AsyncValidator {

  private readonly companyStore = inject(CompanyStore);

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return of(control.value)
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap(value => this.companyStore.checkCompanyName(value)),
        map(isTaken => {
          const successful = !!(isTaken.ok && isTaken.body?.successful);
          return successful ? null : {uniqueCompanyName: true};
        }),
        take(1)
      );
  }

}
