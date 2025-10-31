import {Component} from '@angular/core';
import {Button} from 'primeng/button';
import {JobEditDialog} from '@features/job/components/job.edit.dialog';

@Component({
  selector: 'add-job-button',
  imports: [
    Button,
    JobEditDialog
  ],
  template: `
    <p-button severity="success" (click)="editDialog.toggleDialog()" outlined icon="pi pi-plus"
              label="Beruf hinzufügen"/>
    <job-edit-dialog #editDialog></job-edit-dialog>
  `
})
export class AddJobButton {
}
