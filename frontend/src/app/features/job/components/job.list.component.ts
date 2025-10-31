import {Component, inject, OnInit, signal} from '@angular/core';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Toast} from 'primeng/toast';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {ConfirmationService, MessageService} from 'primeng/api';
import {JobStore} from '@features/job/state/job.store';
import {Job} from '@features/job/models/job.model';
import {JobEditDialog} from '@features/job/components/job.edit.dialog';

@Component({
  selector: 'job-list-component',
  imports: [
    ConfirmDialog,
    Toast,
    Button,
    TableModule,
    JobEditDialog
  ],
  template: `
    <p-toast/>
    <p-confirm-dialog/>

    @if (error()) {

      <span>Ein Fehler ist bei der Anfrage aufgetreten.</span>
      <button (click)="performRetrieval()">Retry</button>

    } @else {
      <p-table [value]="this.jobStore.jobs()">

        <ng-template #caption>
          <div class="flex items-center justify-between">
            <span class="text-xl font-bold">Berufe</span>
            <p-button severity="success" (click)="editDialog.toggleDialog()" outlined icon="pi pi-plus"
                      label="Beruf hinzufügen"/>
          </div>
        </ng-template>

        <ng-template #header>
          <tr>
            <th>Name</th>
            <th>Beschreibung</th>
            <th></th>
          </tr>
        </ng-template>

        @defer (when !loading()) {

          <ng-template #body let-job>
            <tr>
              <td>
                {{ job.name }}
              </td>
              <td>
                {{ job.description }}
              </td>
              <td>
                <div class="flex items-center justify-center gap-1">
                  <p-button severity="secondary" outlined icon="pi pi-pencil" label="Edit"
                            (click)="editDialog.editJob(job)"/>
                  <p-button severity="danger" outlined icon="pi pi-trash" label="Delete"
                            (click)="deleteItem(job, $event)"/>
                </div>
              </td>
            </tr>
          </ng-template>

        } @placeholder (minimum 1s) {
          <p>Loading data...</p>
        }

      </p-table>
      <job-edit-dialog #editDialog></job-edit-dialog>
    }
  `
})
export class JobListComponent implements OnInit {

  readonly loading = signal(false);
  readonly error = signal(false);
  readonly jobStore = inject(JobStore);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  ngOnInit(): void {
    this.performRetrieval();
  }

  performRetrieval() {
    this.loading.set(true);
    this.jobStore.retrieveJobs(this.jobStore.limit(), this.jobStore.offset(), success => {
      this.loading.set(false);
      this.error.set(!success);


    });
  }

  deleteItem(job: Job, $event: Event) {
    this.confirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Möchtest du wirklich diesen Beruf löschen? Diese Entscheidung hat tiefgehende Einflüsse auf die Berichtshefte der Azubis ',
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

        this.jobStore.deleteJob(job.id).then(successful => {

          if (successful) {
            this.messageService.add({
              severity: 'info',
              summary: 'Entfernt',
              detail: 'Der Beruf wurde gelöscht'
            });
            this.performRetrieval();
          } else {
            this.messageService.add({
              severity: 'danger',
              summary: 'Fehler',
              detail: 'Der Beruf konnte nicht gelöscht werden...'
            });
          }

        });
      },
      reject: () => {
      },
    });
  }

}
