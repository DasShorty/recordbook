import {ChangeDetectionStrategy, Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {User, UserType} from '@core/users/models/users.model';
import {UserOptionStore} from '@core/users/state/user.option.store';
import {BookStore} from '@features/book/state/book.store';
import {SelectComponent} from '@shared/select/select.component';
import {HlmButton} from '@spartan-ng/helm/button';

@Component({
  selector: 'book-create',
  imports: [ReactiveFormsModule, SelectComponent, HlmButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
              <span class="text-red-600 text-sm">Das Berichtsheft benötigt einen Azubi</span>
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
              <span class="text-red-600 text-sm">Das Berichtsheft benötigt eine Ausbildungskraft</span>
            }
          }
        </ng-template>
      </select-component>
      <div class="mt-4 flex gap-2 justify-end">
        <button hlmBtn variant="outline" type="button" (click)="closeForm()">Abbrechen</button>
        <button hlmBtn type="submit" [disabled]="formGroup.invalid || loading()">
          {{ loading() ? 'Erstellen...' : 'Erstellen' }}
        </button>
      </div>
    </form>
  `
})
export class BookCreateComponent {

  readonly loading = signal(false);
  readonly userOptionStore = inject(UserOptionStore);
  readonly bookManagerStore = inject(BookStore);
  @Output() closed = new EventEmitter<void>();

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
    this.closed.emit();
  }

  protected submitForm() {

    if (this.formGroup.invalid) {
      return;
    }

    const value = this.formGroup.value;

    const traineeId = value.trainee?.id;
    const trainerIds = value.trainer?.id;

    if (traineeId == undefined || trainerIds == undefined) {
      return;
    }

    this.loading.set(true);

    this.bookManagerStore.createBook(traineeId, trainerIds, (created) => {
      this.loading.set(false);

      if (!created) {
        return;
      }

      const page = this.bookManagerStore.page();
      const size = this.bookManagerStore.size()

      this.bookManagerStore.loadBooks(page, size, () => {
      });

      this.closed.emit();
    });
  }

  protected lazyLoadMoreTrainees() {
    this.userOptionStore.loadOptions(UserType.TRAINEE);
  }

  protected lazyLoadMoreTrainers() {
    this.userOptionStore.loadOptions(UserType.TRAINER);
  }
}

