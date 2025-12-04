import {Component, inject, signal, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {User, UserType} from '@core/users/models/users.model';
import {UserOptionStore} from '@core/users/state/user.option.store';
import {BookManagerStore} from '@features/book/state/book.manager.store';
import {SelectComponent} from '@shared/select/select.component';
import {Button} from 'primeng/button';
import {ProgressSpinner} from 'primeng/progressspinner';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'record-book-manager-dialog',
  imports: [ReactiveFormsModule, SelectComponent, Button, ProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @defer (on viewport) {
      <form [formGroup]="formGroup" class="flex flex-col gap-2">
        <select-component
          placeholder="Azubi wählen"
          (onLazyLoad)="lazyLoadMoreTrainees()"
          (onShow)="this.userOptionStore.retrieveTrainees()"
          [control]="formGroup.controls['trainee']"
          [data]="this.userOptionStore.traineePage().content"
          label="Azubis*">
          <ng-template errors>
            @if (formGroup.controls['trainee'].errors && formGroup.dirty) {
              @if (formGroup.controls['trainee'].hasError('required')) {
                <span>Das Berichtsheft benötigt einen Azubi</span>
              }
            }
          </ng-template>
        </select-component>
        <select-component
          placeholder="Ausbildungskraft wählen"
          (onLazyLoad)="lazyLoadMoreTrainers()"
          (onShow)="this.userOptionStore.retrieveTrainers()"
          [control]="formGroup.controls['trainer']"
          [data]="this.userOptionStore.trainersPage().content"
          label="Ausbildungskräfte*">
          <ng-template errors>
            @if (formGroup.controls['trainer'].errors && formGroup.dirty) {
              @if (formGroup.controls['trainer'].hasError('required')) {
                <span>Das Berichtsheft benötigt einen Azubi</span>
              }
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

  readonly loading = signal(false);
  readonly userOptionStore = inject(UserOptionStore);
  readonly bookManagerStore = inject(BookManagerStore);
  readonly dialogRef = inject(DynamicDialogRef);
  protected readonly formGroup = new FormGroup({
    id: new FormControl(''),
    trainee: new FormControl<User | null>(null, {
      validators: [Validators.required], updateOn: 'change',
    }), trainer: new FormControl<User | null>(null, {
      validators: [Validators.required], updateOn: 'change',
    })
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
    const trainerIds = value.trainer?.id;

    if (traineeId == undefined || trainerIds == undefined) {
      return; // throw an error?
    }

    this.loading.set(true);

    this.bookManagerStore.createBook(traineeId, trainerIds, (created) => {
      this.loading.set(false);

      if (!created) {
        // creation failed or returned null
        return;
      }

      this.dialogRef.close();
    });
  }

  protected lazyLoadMoreTrainees() {
    this.userOptionStore.loadOptions(UserType.TRAINEE); // TODO - error handling
  }

  protected lazyLoadMoreTrainers() {
    this.userOptionStore.loadOptions(UserType.TRAINER); // TODO - error handling
  }
}
