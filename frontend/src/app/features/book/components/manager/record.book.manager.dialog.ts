import {Component, inject, OnInit, signal} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Job} from '@features/job/models/job.model';
import {UserBody, UserType} from '@core/users/models/users.model';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {UserOptionStore} from '@core/users/state/user.option.store';

@Component({
  selector: 'record-book-manager-dialog', imports: [Dialog, Button, ReactiveFormsModule, Select], template: `
    <p-dialog [(visible)]="dialogVisible" [modal]="true">
      <ng-template #header>
        Berichtsheft erstellen
      </ng-template>
      <form [formGroup]="formGroup" class="flex flex-col gap-2">
        <div class="flex items-center gap-5 mb-4">
          <label for="trainee" class="font-semibold w-24">Azubi*</label>
          <p-select
            appendTo="body"
            formControlName="trainee"
            id="trainee"
            class="flex-auto"
            (onLazyLoad)="lazyLoadMoreTrainees()"
            [lazy]="true"
            [options]="this.userOptionStore.trainees()"
            placeholder="Azubi auswählen">
            <ng-template #item #selectedItem let-item>
              {{ item.forename }} {{ item.surname }}
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
          <p-select
            appendTo="body"
            formControlName="trainers"
            id="trainers"
            class="flex-auto"
            (onLazyLoad)="lazyLoadMoreTrainers()"
            [lazy]="true"
            [options]="this.userOptionStore.trainers()"
            placeholder="Ausbildungskraft auswählen">
            <ng-template #item #selectedItem let-item>
              {{ item.forename }} {{ item.surname }}
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
      </form>
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
export class RecordBookManagerDialog implements OnInit {

  readonly error = signal(false);
  readonly loading = signal(false);
  readonly dialogVisible = signal<boolean>(false);
  readonly editMode = signal<boolean>(false);
  readonly userOptionStore = inject(UserOptionStore);
  protected readonly formGroup = new FormGroup({
    id: new FormControl(''), trainee: new FormControl<UserBody | null>(null, {
      validators: [Validators.required], updateOn: 'change',
    }), trainers: new FormControl<UserBody[] | null>(null, {
      validators: [Validators.required], updateOn: 'change',
    }), job: new FormControl<Job | null>(null, {
      validators: [Validators.required], updateOn: 'change',
    }),
  });

  ngOnInit() {
    this.userOptionStore.loadOptions(UserType.TRAINER);
    this.userOptionStore.loadOptions(UserType.TRAINEE);
  }

  toggleDialog() {
    this.dialogVisible.update((value) => !value);
  }

  closeForm() {
    this.formGroup.reset();
    this.dialogVisible.set(false);
  }

  protected submitForm() {

  }

  protected lazyLoadMoreTrainees() {
    this.userOptionStore.loadOptions(UserType.TRAINEE);
  }


  protected lazyLoadMoreTrainers() {
    this.userOptionStore.loadOptions(UserType.TRAINER);
  }
}
