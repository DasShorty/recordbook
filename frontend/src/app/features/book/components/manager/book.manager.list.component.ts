import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {BookStore} from '@features/book/state/book.store';
import {BookCreateComponent} from '@features/book/components/manager/book.create.component';
import {TrainerSwapDialogComponent} from '@features/book/components/manager/trainer.swap.dialog';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {HlmButton} from '@spartan-ng/helm/button';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {lucidePencil, lucidePlus} from '@ng-icons/lucide';

@Component({
  selector: 'book-manager-list',
  imports: [
    RouterLink,
    CommonModule,
    HlmButton,
    NgIcon,
    BookCreateComponent,
    TrainerSwapDialogComponent
  ],
  providers: [provideIcons({lucidePlus, lucidePencil})],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col h-full gap-4 overflow-hidden">
      <div class="flex items-center justify-between gap-2 mb-2">
        <h1 class="text-xl font-bold">Berichtshefte</h1>
        <button hlmBtn (click)="openDialog()" [disabled]="createDialogOpen()">
          <ng-icon name="lucidePlus" class="w-4 h-4"/>
          Berichtsheft anlegen
        </button>
      </div>

      <div class="overflow-auto border rounded-md flex-1">
        <table class="w-full border-collapse text-sm">
          <thead class="sticky top-0 bg-gray-100 border-b">
          <tr>
            <th class="px-4 py-2 text-left font-medium">Azubi</th>
            <th class="px-4 py-2 text-left font-medium">Ausbildungskraft</th>
          </tr>
          </thead>
          <tbody>
            @for (book of this.bookManagerStore.books(); track book.id) {
              <tr class="border-b hover:bg-gray-50 transition cursor-pointer"
                  [routerLink]="'/record-book/manage/view/' + book.id">
                <td class="px-4 py-3">{{ book.trainee.forename }} {{ book.trainee.surname }}</td>
                <td class="px-4 py-3 flex items-center justify-between">
                  <span>{{ book.trainer.forename }} {{ book.trainer.surname }}</span>
                  <button
                    hlmBtn
                    variant="ghost"
                    size="sm"
                    (click)="openTrainerSwapDialog($event, book)"
                  >
                    <ng-icon name="lucidePencil" class="w-4 h-4"/>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="2" class="px-4 py-8 text-center text-gray-500">
                  Keine Berichtshefte gefunden
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Book Create Dialog -->
    @if (createDialogOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
           (click)="createDialogOpen.set(false)">
        <div class="w-full max-w-2xl rounded-md bg-white p-4 max-h-96 overflow-auto" (click)="$event.stopPropagation()">
          <h2 class="mb-4 text-lg font-semibold">Berichtsheft erstellen</h2>
          <book-create (closed)="onCreateDialogClosed()"></book-create>
        </div>
      </div>
    }

    <!-- Trainer Swap Dialog -->
    @if (trainerSwapDialogOpen() && selectedBook()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
           (click)="trainerSwapDialogOpen.set(false)">
        <div class="w-full max-w-2xl rounded-md bg-white p-4 max-h-96 overflow-auto" (click)="$event.stopPropagation()">
          <h2 class="mb-4 text-lg font-semibold">Ausbildungskraft ändern</h2>
          <trainer-swap-dialog [book]="selectedBook()" (closed)="onTrainerSwapDialogClosed()"></trainer-swap-dialog>
        </div>
      </div>
    }
  `,
  styles: `
    tr:hover {
      background-color: var(--color-gray-100);
    }
  `
})
export class BookManagerListComponent implements OnInit {

  readonly loading = signal(false);
  readonly error = signal(false);
  readonly createDialogOpen = signal(false);
  readonly trainerSwapDialogOpen = signal(false);
  readonly selectedBook = signal<any>(null);
  readonly bookManagerStore = inject(BookStore);

  ngOnInit() {
    this.loadBooks();
  }

  protected openDialog() {
    this.createDialogOpen.set(true);
  }

  protected openTrainerSwapDialog(event: Event, book: any) {
    event.stopPropagation();
    this.selectedBook.set(book);
    this.trainerSwapDialogOpen.set(true);
  }

  protected onCreateDialogClosed() {
    this.createDialogOpen.set(false);
    this.loadBooks();
  }

  protected onTrainerSwapDialogClosed() {
    this.trainerSwapDialogOpen.set(false);
    this.selectedBook.set(null);
    this.loadBooks();
  }

  private loadBooks() {
    this.loading.set(true);
    this.bookManagerStore.loadBooks(0, 20, (success) => {
      this.loading.set(false);
      this.error.set(!success);
    });
  }

}
