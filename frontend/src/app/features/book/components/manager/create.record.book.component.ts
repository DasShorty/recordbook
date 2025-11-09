import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserBody, UserType} from '@core/users/models/users.model';
import {UserOptionStore} from '@core/users/state/user.option.store';
import {JobOptionStore} from '@features/job/state/job.option.store';
import {BookManagerStore} from '@features/book/state/book.manager.store';
import {SelectOption} from '@shared/http/model/select.option.model';
import {SelectComponent} from '@shared/select/select.component';
import {MultiSelectComponent} from '@shared/select/multi.select.component';
import {Button} from 'primeng/button';
import {ProgressSpinner} from 'primeng/progressspinner';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'record-book-manager-dialog',
  imports: [ReactiveFormsModule, SelectComponent, SelectComponent, MultiSelectComponent, Button, ProgressSpinner],
  template: `
    @defer (on viewport) {
      <form [formGroup]="formGroup" class="flex flex-col gap-2">
        <select-component
          placeholder="Azubi wählen"
          (onLazyLoad)="lazyLoadMoreTrainees()"
          (onShow)="this.userOptionStore.retrieveTrainees()"
          [control]="formGroup.controls['trainee']"
          [data]="this.userOptionStore.trainees()"
          label="Azubis*">
          <ng-template errors>
            @if (formGroup.controls['trainee'].errors && formGroup.dirty) {
              @if (formGroup.controls['trainee'].hasError('required')) {
                <span>Das Berichtsheft benötigt einen Azubi</span>
              }
            }
          </ng-template>
        </select-component>
        <multi-select-component
          placeholder="Ausbildungskraft wählen"
          (onLazyLoad)="lazyLoadMoreTrainers()"
          (onShow)="this.userOptionStore.retrieveTrainers()"
          [control]="formGroup.controls['trainers']"
          [data]="this.userOptionStore.trainers()"
          label="Ausbildungskräfte*">
          <ng-template errors>
            @if (formGroup.controls['trainee'].errors && formGroup.dirty) {
              @if (formGroup.controls['trainee'].hasError('required')) {
                <span>Das Berichtsheft benötigt einen Azubi</span>
              }
            }
          </ng-template>
        </multi-select-component>
        <select-component
          placeholder="Beruf wählen"
          (onLazyLoad)="this.jobOptionStore.retrieveJobsLazy()"
          (onShow)="this.jobOptionStore.retrieveJobs()"
          [control]="formGroup.controls['job']"
          [data]="this.jobOptionStore.jobs()"
          label="Beruf*">
          <ng-template errors>
            @if (formGroup.controls['job'].errors && formGroup.dirty) {
              @if (formGroup.controls['job'].hasError('required')) {
                <span>Das Berichtsheft benötigt einen Azubi</span>
              }d

            }
          </ng-template>
        </select-component>
        <div class="mt-2 flex gap-1 justify-end">
          <p-button label="Abbrechen" outlined severity="danger" (click)="closeForm()"/>
          <p-button
            type="submit"
            [disabled]="formGroup.invalid"
            severity="success"
            [loading]="loading()"
            label="Erstellen"
            (click)="submitForm()"
          />
        </div>
      </form>
    } @placeholder {
      <div class="flex justify-center items-center">
        <p-progress-spinner ariaLabel="loading"></p-progress-spinner>
      </div>
    }
  `
})
export class CreateRecordBookComponent {

  readonly error = signal(false);
  readonly loading = signal(false);
  readonly jobOptionStore = inject(JobOptionStore);
  readonly userOptionStore = inject(UserOptionStore);
  readonly bookManagerStore = inject(BookManagerStore);
  readonly dialogRef = inject(DynamicDialogRef);
  protected readonly formGroup = new FormGroup({
    id: new FormControl(''),
    trainee: new FormControl<UserBody | null>(null, {
      validators: [Validators.required], updateOn: 'change',
    }), trainers: new FormControl<UserBody[] | null>(null, {
      validators: [Validators.required], updateOn: 'change',
    }), job: new FormControl<SelectOption<String> | null>(null, {
      validators: [Validators.required], updateOn: 'change',
    }),
  });

  closeForm() {
    this.formGroup.reset();
    this.dialogRef.close();
  }

  protected submitForm() {

    if (this.formGroup.invalid) {
      return;
    }

    const value = this.formGroup.value;

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

      this.dialogRef.close();
    });
  }

  protected lazyLoadMoreTrainees() {
    this.userOptionStore.loadOptions(UserType.TRAINEE).then(); // TODO - error handling
  }

  protected lazyLoadMoreTrainers() {
    this.userOptionStore.loadOptions(UserType.TRAINER).then(); // TODO - error handling
  }
}
