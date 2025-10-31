import {Component, inject, OnInit, signal} from '@angular/core';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Toast} from 'primeng/toast';
import {TableModule} from 'primeng/table';
import {QualificationStore} from '@features/job/state/qualification.store';
import {Button} from 'primeng/button';
import {AddQualificationsButton} from '@features/job/components/qualification/add.qualifications.button';
import {QualificationEditDialog} from '@features/job/components/qualification/qualification.edit.dialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Qualification} from '@features/job/models/qualification.model';

@Component({
  selector: 'qualifications-list-component',
  imports: [
    ConfirmDialog,
    Toast,
    TableModule,
    Button,
    AddQualificationsButton,
    QualificationEditDialog
  ],
  template: `
    <p-toast/>
    <p-confirm-dialog/>

    @if (error()) {

      <span>Ein Fehler ist bei der Anfrage aufgetreten.</span>
      <button (click)="performRetrieval()">Retry</button>

    } @else {
      <p-table [value]="this.qualificationStore.qualifications()">

        <ng-template #caption>
          <div class="flex items-center justify-between">
            <span class="text-xl font-bold">Qualifikationen</span>
            <add-qualifications-button></add-qualifications-button>
          </div>
        </ng-template>

        <ng-template #header>
          <tr>
            <th>Name</th>
            <th>Beschreibung</th>
            <th>Pflichtzeit</th>
            <th></th>
          </tr>
        </ng-template>

        @defer (when !loading()) {

          <ng-template #body let-qualification>
            <tr>
              <td>
                {{ qualification.name }}
              </td>
              <td>
                {{ qualification.description }}
              </td>
              <td>
                {{ qualification.minimumDuration }}h
              </td>
              <td>
                <div class="flex items-center justify-center gap-1">
                  <p-button severity="secondary" outlined icon="pi pi-pencil" label="Edit"
                            (click)="editDialog.editQualification(qualification)"/>
                  <p-button severity="danger" outlined icon="pi pi-trash" label="Delete"
                            (click)="deleteItem(qualification, $event)"/>
                </div>
              </td>
            </tr>
          </ng-template>

        } @placeholder (minimum 1s) {
          <p>Loading data...</p>
        }

      </p-table>
      <qualification-edit-dialog #editDialog></qualification-edit-dialog>
    }

  `
})
export class QualificationsListComponent implements OnInit {

  readonly loading = signal(false);
  readonly error = signal(false);
  readonly qualificationStore = inject(QualificationStore);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  ngOnInit(): void {
    this.performRetrieval();
  }

  performRetrieval() {
    this.loading.set(true);
    this.qualificationStore.retrieveQualifications(this.qualificationStore.limit(), this.qualificationStore.offset(), success => {
      this.loading.set(false);
      this.error.set(!success);


    });
  }

  deleteItem(qualification: Qualification, $event: Event) {
    this.confirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Möchtest du wirklich diese Qualifikation löschen? Diese Entscheidung hat tiefgehende Einflüsse auf die Berichtshefte der Azubis ',
      header: 'Bestätigung der Löschung',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Abbrechen',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Löschen',
        severity: 'danger',
      },
      accept: () => {

        this.qualificationStore.deleteQualification(qualification.id).then(successful => {

          if (successful) {
            this.messageService.add({
              severity: 'info',
              summary: 'Entfernt',
              detail: 'Die Qualifikation wurde gelöscht'
            });
            this.performRetrieval();
          } else {
            this.messageService.add({
              severity: 'danger',
              summary: 'Fehler',
              detail: 'Die Qualifikation konnte nicht gelöscht werden...'
            });
          }

        });
      },
      reject: () => {
      },
    });
  }
}
