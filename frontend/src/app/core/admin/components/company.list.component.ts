import {ChangeDetectionStrategy, Component, computed, inject, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {CompanyStore} from '@shared/company/company.store';

@Component({
  selector: 'company-list-component',
  imports: [
    TableModule
  ],
  template: `
    <p-table [value]="companyData()">
      <ng-template #header>
        <tr>
          <th>Name</th>
          <th>Azubis</th>
          <th>Ausbildungskräfte</th>
        </tr>
      </ng-template>
      <ng-template #body let-company>
        <tr>
          <td>{{company.name}}</td>
          <td class="text-right">0</td>
          <td class="text-right">0</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyListComponent implements OnInit{

  private readonly companyStore = inject(CompanyStore);
  readonly companyData = computed(() => this.companyStore.companies());

  ngOnInit() {
    this.companyStore.retrieveCompanies(this.companyStore.offset(), this.companyStore.limit());
  }

}
