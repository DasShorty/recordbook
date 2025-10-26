import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {CompanyStore} from '@shared/company/company.store';
import {Button} from 'primeng/button';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Company} from '@shared/company/company.model';
import {Toast} from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
  selector: 'company-list-component',
  imports: [
    TableModule,
    Button,
    Toast,
    ConfirmDialog
  ],
  template: `
    <p-toast/>
    <p-confirm-dialog/>
    <p-table [value]="this.companyStore.companies()">
      <ng-template #header>
        <tr>
          <th>Name</th>
          <th>Azubis</th>
          <th>Ausbildungskräfte</th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-company>
        <tr>
          <td>{{ company.companyName }}</td>
          <td class="text-right">0</td>
          <td class="text-right">0</td>
          <td><p-button severity="danger" outlined icon="pi pi-trash" (onClick)="deleteItem(company, $event)"></p-button></td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class CompanyListComponent implements OnInit {

  readonly companyStore = inject(CompanyStore);
  readonly confirmationService = inject(ConfirmationService);
  readonly messageService = inject(MessageService);

  ngOnInit() {
    this.companyStore.retrieveCompanies(this.companyStore.offset(), this.companyStore.limit());
  }

  deleteItem(company: Company, event: Event) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Achtung',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {

        this.companyStore.deleteCompany(company.id).then(value => {

          if (value) {

                        this.companyStore.retrieveCompanies(this.companyStore.offset(), this.companyStore.limit());

            this.messageService.add({
              severity: 'secondary',
              text: 'Das Unternehmen wurde gelöscht.',
              summary: 'Unternehmen gelöscht!'
            });

          } else {
            this.messageService.add({
              severity: 'danger',
              text: 'Unternehmen konnte nicht gelöscht werden',
              summary: 'Löschen fehlgeschlagen'
            });
          }

                });

      },
      reject: () => {
        // ignored
      }
    });
  }

}
