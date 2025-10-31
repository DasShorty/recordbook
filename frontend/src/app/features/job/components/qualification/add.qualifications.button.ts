import {Component} from '@angular/core';
import {Button} from 'primeng/button';
import {ReactiveFormsModule} from '@angular/forms';
import {QualificationEditDialog} from '@features/job/components/qualification/qualification.edit.dialog';

@Component({
  selector: 'add-qualifications-button',
  imports: [
    Button,
    ReactiveFormsModule,
    QualificationEditDialog
  ],
  template: `
    <p-button severity="success" (click)="editDialog.toggleDialog()" outlined icon="pi pi-plus"
              label="Qualifikation hinzufügen"/>
    <qualification-edit-dialog #editDialog></qualification-edit-dialog>
  `
})
export class AddQualificationsButton {
}
