import {Component, inject, OnInit, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Optional} from '@shared/data/optional';
import {JobStore} from '@features/job/state/job.store';
import {Job, UpdateJob} from '@features/job/models/job.model';
import {MultiSelect} from 'primeng/multiselect';
import {Qualification} from '@features/job/models/qualification.model';
import {QualificationSearchStore} from '@features/job/state/qualification.search.store';

@Component({
  selector: 'job-edit-dialog',
  imports: [Button, Dialog, InputText, ReactiveFormsModule, MultiSelect],
  template: `
    <p-dialog [(visible)]="dialogVisible" [modal]="true">
      <ng-template #header> Beruf {{ this.editMode() ? 'bearbeiten' : 'erstellen' }}</ng-template>
      <form [formGroup]="formGroup" (submit)="submitForm()" class="flex flex-col gap-1">
        <div class="flex items-center gap-4 mb-4">
          <label for="name" class="font-semibold w-24">Name*</label>
          <input pInputText formControlName="name" id="name" class="flex-auto" autocomplete="off"/>
        </div>
        <div class="flex flex-col gap-0.5">
          @if (formGroup.controls['name'].errors && formGroup.dirty) {
            @if (formGroup.controls['name'].hasError('required')) {
              <span>Ein Name für den Beruf muss angegeben werden.</span>
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
              <span>Der Beruf benötigt eine Beschreibung.</span>
            }
          }
        </div>
        <div class="flex items-center gap-5 mb-4">
          <label for="qualifications" class="font-semibold w-24">Qualifikationen*</label>
          <p-multi-select
            appendTo="body"
            formControlName="qualifications"
            id="qualifications"
            class="flex-auto"
            (onLazyLoad)="lazyLoadQualifications()"
            [lazy]="true"
            [filter]="true"
            [options]="this.qualificationStore.qualifications()"
            placeholder="Qualifikation auswählen"
            optionLabel="name">
          </p-multi-select>
        </div>
        <div class="flex flex-col gap-0.5">
          @if (formGroup.controls['qualifications'].errors && formGroup.dirty) {
            @if (formGroup.controls['qualifications'].hasError('required')) {
              <span>Der Beruf benötigt Qualifikationen.</span>
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
        <p-button label="Abbrechen" outlined severity="danger" (click)="closeForm()"/>
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
export class JobEditDialog implements OnInit {
  readonly error = signal(false);
  readonly loading = signal(false);
  readonly dialogVisible = signal<boolean>(false);
  readonly editMode = signal<boolean>(false);
  readonly jobStore = inject(JobStore);
  readonly qualificationStore = inject(QualificationSearchStore);
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
    qualifications: new FormControl<Qualification[] | null>(null, {
      validators: [Validators.required],
      updateOn: 'change',
    }),
  });

  ngOnInit() {
    this.qualificationStore.loadMoreQualifications().then();
  }

  closeForm() {
    this.formGroup.reset();
    this.toggleDialog();
  }

  toggleDialog() {
    this.dialogVisible.update((value) => !value);
  }

  editJob(job: Job) {
    this.editMode.set(true);
    this.dialogVisible.set(true);
    this.loadDataIntoForm(job);
  }

  lazyLoadQualifications() {
    this.qualificationStore.loadMoreQualifications().then();
  }

  protected submitForm() {
    this.loading.set(true);

    const formContent = this.formGroup.value;

    if (
      formContent.name == null ||
      formContent.description == null ||
      formContent.qualifications == null
    ) {
      return;
    }

    const qualifications = formContent.qualifications.filter((value): value is Qualification => !!value && 'id' in value)
      .map(value => value.id);

    if (this.editMode()) {
      this.jobStore.updateJob({
        id: formContent.id,
        name: formContent.name,
        description: formContent.description,
        qualifications: qualifications
      } as UpdateJob).then((res) => this.handleResponse(res));
      return;
    }

    this.jobStore
      .createJob({
        name: formContent.name,
        description: formContent.description,
        qualifications: qualifications,
      })
      .then((res) => this.handleResponse(res));
  }

  private handleResponse(optional: Optional<Job>) {
    this.loading.set(false);

    if (optional.isEmpty()) {
      this.error.set(true);
      return;
    }

    if (this.editMode()) {
      this.jobStore.replaceJob(optional.get());
    } else {
      this.jobStore.retrieveJobs(this.jobStore.limit(), this.jobStore.offset());
    }

    this.error.set(false);
    this.toggleDialog();
  }

  private loadDataIntoForm(job: Job) {
    this.formGroup.controls['id'].setValue(job.id);
    this.formGroup.controls['name'].setValue(job.name);
    this.formGroup.controls['description'].setValue(job.description);
    this.formGroup.controls['qualifications'].setValue(job.qualifications);
  }
}
