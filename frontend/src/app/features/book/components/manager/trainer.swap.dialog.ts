import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {User, UserType} from '@core/users/models/users.model';
import {UserOptionStore} from '@core/users/state/user.option.store';
import {BookStore} from '@features/book/state/book.store';
import {SelectComponent} from '@shared/select/select.component';
import {Button} from 'primeng/button';
import {ProgressSpinner} from 'primeng/progressspinner';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'trainer-swap-dialog',
  imports: [ReactiveFormsModule, SelectComponent, Button, ProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @defer (on viewport) {
      <form [formGroup]="formGroup" class="flex flex-col gap-4">
        <div class="text-sm text-surface-600">
          <p>Aktueller Ausbildungskraft: <strong>{{ currentTrainer.forename }} {{ currentTrainer.surname }}</strong></p>
        </div>

        <select-component
          placeholder="Neue Ausbildungskraft wählen"
          (onLazyLoad)="lazyLoadMoreTrainers()"
          (onShow)="this.userOptionStore.retrieveTrainers()"
          [control]="formGroup.controls['trainer']"
          [data]="this.userOptionStore.trainersPage().content"
          label="Ausbildungskraft*">
          <ng-template errors>
            @if (formGroup.controls['trainer'].errors && formGroup.dirty) {
              @if (formGroup.controls['trainer'].hasError('required')) {
                <span>Bitte wähle eine neue Ausbildungskraft</span>
              }
            }
          </ng-template>
        </select-component>

        <div class="mt-4 flex gap-2 justify-end">
          <p-button
            label="Abbrechen"
            outlined
            severity="danger"
            (click)="closeDialog()"/>
          <p-button
            type="submit"
            [disabled]="formGroup.invalid || loading()"
            severity="success"
            [loading]="loading()"
            label="Änderungen bestätigen"
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
export class TrainerSwapDialogComponent {

  readonly loading = signal(false);
  readonly userOptionStore = inject(UserOptionStore);
  readonly bookStore = inject(BookStore);
  readonly dialogRef = inject(DynamicDialogRef);
  readonly messageService = inject(MessageService);
  readonly config = inject(DynamicDialogConfig);

  bookId: string = '';
  currentTrainer: User = {} as User;

  protected readonly formGroup = new FormGroup({
    trainer: new FormControl<User | null>(null, {
      validators: [Validators.required],
      updateOn: 'change',
    })
  });

  constructor() {
    if (this.config.data) {
      this.bookId = this.config.data.bookId;
      this.currentTrainer = this.config.data.currentTrainer;
    }
  }

  closeDialog() {
    this.formGroup.reset();
    this.dialogRef.close();
  }

  protected submitForm() {
    if (this.formGroup.invalid) {
      return;
    }

    const selectedTrainer = this.formGroup.value.trainer;

    if (!selectedTrainer || !selectedTrainer.id) {
      return;
    }

    // Check if same trainer selected
    if (selectedTrainer.id === this.currentTrainer.id) {
      this.messageService.add({
        severity: 'info',
        summary: 'Keine Änderung',
        detail: 'Die ausgewählte Ausbildungskraft ist bereits zugeordnet.',
        life: 3000
      });
      return;
    }

    this.loading.set(true);

    this.bookStore.updateTrainer(this.bookId, selectedTrainer.id, (result) => {
      this.loading.set(false);

      if (!result.ok || !result.data) {
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: 'Die Ausbildungskraft konnte nicht aktualisiert werden.',
          life: 3000
        });
        return;
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Erfolg',
        detail: 'Ausbildungskraft wurde erfolgreich aktualisiert.',
        life: 3000
      });

      this.dialogRef.close();
    });
  }

  protected lazyLoadMoreTrainers() {
    this.userOptionStore.loadOptions(UserType.TRAINER);
  }
}
