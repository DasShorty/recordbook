import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QualificationStore } from '@features/job/state/qualification.store';
import { Qualification } from '@features/job/models/qualification.model';
import { Optional } from '@shared/data/optional';

@Component({
  selector: 'qualification-edit-dialog',
  imports: [Button, Dialog, InputNumber, InputText, ReactiveFormsModule],
  template: `
    <p-dialog [(visible)]="dialogVisible" [modal]="true">
      <ng-template #header>
        Qualifikation {{ this.editMode() ? 'bearbeiten' : 'erstellen' }}
      </ng-template>
      <form [formGroup]="formGroup" (submit)="submitForm()" class="flex flex-col gap-1">
        <div class="flex items-center gap-4 mb-4">
          <label for="name" class="font-semibold w-24">Name*</label>
          <input pInputText formControlName="name" id="name" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex flex-col gap-0.5">
          @if (formGroup.controls['name'].errors && formGroup.dirty) {
            @if (formGroup.controls['name'].hasError('required')) {
              <span>Ein Name für die Qualifikation muss angegeben werden.</span>
            }
          }
        </div>
        <div class="flex items-center gap-5 mb-4">
          <label for="description" class="font-semibold w-24">Beschreibung*</label>
          <input
            pInputText
            formControlName="description"
            id="description"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex flex-col gap-0.5">
          @if (formGroup.controls['description'].errors && formGroup.dirty) {
            @if (formGroup.controls['description'].hasError('required')) {
              <span>Die Qualifikation benötigt eine Beschreibung.</span>
            }
          }
        </div>
        <div class="flex items-center gap-4 mb-4">
          <label for="minimumDuration" class="font-semibold w-24">Pflichtzeit*</label>
          <p-inputNumber
            formControlName="minimumDuration"
            id="minimumDuration"
            [step]="0.1"
            suffix=" h"
            mode="decimal"
            class="flex-auto"
            [showButtons]="true"
          ></p-inputNumber>
        </div>
        <div class="flex flex-col gap-0.5">
          @if (formGroup.controls['minimumDuration'].errors && formGroup.dirty) {
            @if (formGroup.controls['minimumDuration'].hasError('required')) {
              <span>Die Qualifikation benötigt eine Pflichtzeit.</span>
            }
            @if (formGroup.controls['minimumDuration'].hasError('min')) {
              <span>Die Pflichtzeit muss mindestens 1h betragen.</span>
            }
            @if (formGroup.controls['minimumDuration'].hasError('max')) {
              <span>Die Pflichtzeit darf nicht länger als 24h sein.</span>
            }
          }
        </div>
      </form>
      @if (error()) {
        <span
          >Ein Fehler ist bei der Übertragung der Daten aufgetreten. Bitte versuche es erneut!</span
        >
      }
      <ng-template #footer>
        <p-button label="Abbrechen" outlined severity="danger" (click)="closeForm()" />
        <p-button
          type="submit"
          [disabled]="formGroup.invalid"
          severity="success"
          [loading]="loading()"
          [label]="editMode() ? 'Speichern' : 'Erstellen'"
          (click)="submitForm()"
        />
      </ng-template>
    </p-dialog>
  `,
})
export class QualificationEditDialog {
  readonly error = signal(false);
  readonly loading = signal(false);
  readonly dialogVisible = signal<boolean>(false);
  readonly editMode = signal<boolean>(false);
  readonly qualificationStore = inject(QualificationStore);
  protected readonly formGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl<string | null>(null, {
      validators: [Validators.required],
      updateOn: 'change',
    }),
    description: new FormControl<string | null>(null, {
      validators: [Validators.required],
      updateOn: 'change',
    }),
    minimumDuration: new FormControl<number | null>(null, {
      validators: [Validators.min(1), Validators.max(24)],
      updateOn: 'change',
    }),
  });

  closeForm() {
    this.formGroup.reset();
    this.toggleDialog();
  }

  toggleDialog() {
    this.dialogVisible.update((value) => !value);
  }

  editQualification(qualification: Qualification) {
    this.editMode.set(true);
    this.dialogVisible.set(true);
    this.loadDataIntoForm(qualification);
  }

  protected submitForm() {
    this.loading.set(true);

    const formContent = this.formGroup.value;

    if (
      formContent.name == null ||
      formContent.minimumDuration == null ||
      formContent.description == null
    ) {
      return;
    }

    if (this.editMode()) {
      this.qualificationStore
        .updateQualification(formContent as Qualification)
        .then((res) => this.handleResponse(res));
      return;
    }

    this.qualificationStore
      .createQualification({
        name: formContent.name,
        description: formContent.description,
        minimumDuration: formContent.minimumDuration,
      })
      .then((res) => this.handleResponse(res));
  }

  private handleResponse(optional: Optional<Qualification>) {
    this.loading.set(false);

    if (optional.isEmpty()) {
      this.error.set(true);
      return;
    }

    if (this.editMode()) {
      this.qualificationStore.replaceQualification(optional.get());
    } else {
      this.qualificationStore.retrieveQualifications(
        this.qualificationStore.limit(),
        this.qualificationStore.offset(),
      );
    }

    this.error.set(false);
    this.toggleDialog();
  }

  private loadDataIntoForm(qualification: Qualification) {
    this.formGroup.controls['id'].setValue(qualification.id);
    this.formGroup.controls['name'].setValue(qualification.name);
    this.formGroup.controls['description'].setValue(qualification.description);
    this.formGroup.controls['minimumDuration'].setValue(qualification.minimumDuration);
  }
}
