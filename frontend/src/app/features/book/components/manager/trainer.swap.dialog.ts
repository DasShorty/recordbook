import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {User, UserType} from '@core/users/models/users.model';
import {UserOptionStore} from '@core/users/state/user.option.store';
import {BookStore} from '@features/book/state/book.store';
import {SelectComponent} from '@shared/select/select.component';
import {HlmButton} from '@spartan-ng/helm/button';

@Component({
  selector: 'trainer-swap-dialog',
  imports: [ReactiveFormsModule, SelectComponent, HlmButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
              <span class="text-red-600 text-sm">Bitte wähle eine neue Ausbildungskraft</span>
            }
          }
        </ng-template>
      </select-component>

      <div class="mt-4 flex gap-2 justify-end">
        <button hlmBtn variant="outline" type="button" (click)="closeDialog()">
          Abbrechen
        </button>
        <button hlmBtn
                type="submit"
                [disabled]="formGroup.invalid || loading()"
                (click)="submitForm()"
        >
          {{ loading() ? 'Speichern...' : 'Änderungen bestätigen' }}
        </button>
      </div>
    </form>

    @if (notification(); as notif) {
      <div
        class="fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white z-50"
        [class.bg-green-600]="notif.type === 'success'"
        [class.bg-red-600]="notif.type === 'error'"
        [class.bg-blue-600]="notif.type === 'info'"
      >
        {{ notif.message }}
      </div>
    }
  `
})
export class TrainerSwapDialogComponent {

  @Input() book: any;
  @Output() closed = new EventEmitter<void>();

  readonly loading = signal(false);
  readonly userOptionStore = inject(UserOptionStore);
  readonly bookStore = inject(BookStore);
  readonly notification = signal<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  bookId: string = '';
  currentTrainer: User = {} as User;

  protected readonly formGroup = new FormGroup({
    trainer: new FormControl<User | null>(null, {
      validators: [Validators.required],
      updateOn: 'change',
    })
  });

  constructor() {
    this.bookId = this.book?.id || '';
    this.currentTrainer = this.book?.trainer || ({} as User);
  }

  closeDialog() {
    this.formGroup.reset();
    this.closed.emit();
  }

  protected showNotification(message: string, type: 'success' | 'error' | 'info') {
    this.notification.set({message, type});
    setTimeout(() => this.notification.set(null), 3000);
  }

  protected submitForm() {
    if (this.formGroup.invalid) {
      return;
    }

    const selectedTrainer = this.formGroup.value.trainer;

    if (!selectedTrainer || !selectedTrainer.id) {
      return;
    }

    if (selectedTrainer.id === this.currentTrainer.id) {
      this.showNotification('Die ausgewählte Ausbildungskraft ist bereits zugeordnet.', 'info');
      return;
    }

    this.loading.set(true);

    this.bookStore.updateTrainer(this.bookId, selectedTrainer.id, (result) => {
      this.loading.set(false);

      if (!result.ok || !result.data) {
        this.showNotification('Die Ausbildungskraft konnte nicht aktualisiert werden.', 'error');
        return;
      }

      this.showNotification('Ausbildungskraft wurde erfolgreich aktualisiert.', 'success');
      this.closed.emit();
    });
  }

  protected lazyLoadMoreTrainers() {
    this.userOptionStore.loadOptions(UserType.TRAINER);
  }
}
