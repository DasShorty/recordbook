import {Component, inject, signal} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {JobOption} from '@features/job/models/job.model';
import {UserBody, UserType} from '@core/users/models/users.model';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {UserOptionStore} from '@core/users/state/user.option.store';
import {JobOptionStore} from '@features/job/state/job.option.store';
import {BookManagerStore} from '@features/book/state/book.manager.store';
import {MultiSelect} from 'primeng/multiselect';

@Component({
  selector: 'record-book-manager-dialog', imports: [Dialog, Button, ReactiveFormsModule, Select, MultiSelect], template: `
    <p-dialog [(visible)]="dialogVisible" [modal]="true">
      <ng-template #header>
        Berichtsheft erstellen
      </ng-template>
      @defer (on viewport) {
        <form [formGroup]="formGroup" class="flex flex-col gap-2">
          <div class="flex items-center gap-5 mb-4">
            <label for="trainee" class="font-semibold w-24">Azubi*</label>
            <p-select
              appendTo="body"
              formControlName="trainee"
              class="flex-auto"
              (onShow)="this.userOptionStore.retrieveTrainees()"
              (onLazyLoad)="lazyLoadMoreTrainees()"
              [lazy]="true"
              [options]="this.userOptionStore.trainees()"
              placeholder="Azubi auswählen">
              <ng-template #item #selectedItem let-item>
                {{ item.name }}
              </ng-template>
            </p-select>
          </div>
          <div class="flex flex-col gap-0.5">
            @if (formGroup.controls['trainee'].errors && formGroup.dirty) {
              @if (formGroup.controls['trainee'].hasError('required')) {
                <span>Das Berichtsheft benötigt einen Azubi</span>
              }
            }
          </div>
          <div class="flex items-center gap-5 mb-4">
            <label for="trainers" class="font-semibold w-24">Ausbildungskräfte*</label>
            <p-multi-select
              appendTo="body"
              formControlName="trainers"
              class="flex-auto"
              (onLazyLoad)="lazyLoadMoreTrainers()"
              [lazy]="true"
              display="chip"
              optionLabel="name"
              (onPanelShow)="this.userOptionStore.retrieveTrainers()"
              [options]="this.userOptionStore.trainers()"
              placeholder="Ausbildungskraft auswählen">
            </p-multi-select>
          </div>
          <div class="flex flex-col gap-0.5">
            @if (formGroup.controls['trainee'].errors && formGroup.dirty) {
              @if (formGroup.controls['trainee'].hasError('required')) {
                <span>Das Berichtsheft benötigt einen Azubi</span>
              }
            }
          </div>
          <div class="flex items-center gap-5 mb-4">
            <label for="job" class="font-semibold w-24">Beruf*</label>
            <p-select
              appendTo="body"
              formControlName="job"
              class="flex-auto"
              (onLazyLoad)="this.jobOptionStore.retrieveJobsLazy()"
              [lazy]="true"
              (onShow)="this.jobOptionStore.retrieveJobs()"
              [options]="this.jobOptionStore.jobs()"
              placeholder="Beruf wählen">
              <ng-template #item #selectedItem let-item>
                {{ item.name }}
              </ng-template>
            </p-select>
          </div>
          <div class="flex flex-col gap-0.5">
            @if (formGroup.controls['job'].errors && formGroup.dirty) {
              @if (formGroup.controls['job'].hasError('required')) {
                <span>Das Berichtsheft benötigt einen Azubi</span>
              }
            }
          </div>
        </form>
      } @placeholder (minimum 1s) {
        <span>Lade Formular...</span>
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
  `
})
export class RecordBookManagerDialog {

  readonly error = signal(false);
  readonly loading = signal(false);
  readonly dialogVisible = signal<boolean>(false);
  readonly editMode = signal<boolean>(false);
  readonly jobOptionStore = inject(JobOptionStore);
  readonly userOptionStore = inject(UserOptionStore);
  readonly bookManagerStore = inject(BookManagerStore);
  protected readonly formGroup = new FormGroup({
    id: new FormControl(''),
    trainee: new FormControl<UserBody | null>(null, {
      validators: [Validators.required], updateOn: 'change',
    }),
    trainers: new FormControl<UserBody[] | null>(null, {
      validators: [Validators.required], updateOn: 'change',
    }),
    job: new FormControl<JobOption | null>(null, {
      validators: [Validators.required], updateOn: 'change',
    }),
  });

  toggleDialog() {
    this.dialogVisible.update((value) => !value);
  }

  closeForm() {
    this.formGroup.reset();
    this.dialogVisible.set(false);
  }

  protected submitForm() {

    if (this.formGroup.invalid) {
      return;
    }

    const value = this.formGroup.value;

    console.log(value);

    const traineeId = value.trainee?.id;
    const trainerIds = value.trainers?.map(value => value.id);
    const jobId = value.job?.id;

    if (traineeId == undefined || trainerIds == undefined || jobId == undefined) {
      return; // throw an error?
    }

    this.bookManagerStore.createBook(traineeId, trainerIds, jobId).then(value1 => {
      if (value1.isEmpty()) {
        return;
      }

      this.toggleDialog();
    });
  }

  protected lazyLoadMoreTrainees() {
    this.userOptionStore.loadOptions(UserType.TRAINEE).then(); // TODO - error handling
  }


  protected lazyLoadMoreTrainers() {
    this.userOptionStore.loadOptions(UserType.TRAINER).then(); // TODO - error handling
  }
}
