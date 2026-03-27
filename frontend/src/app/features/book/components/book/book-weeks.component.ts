import {Component, effect, inject, signal, untracked} from '@angular/core';
import {BookStore} from '@features/book/state/book.store';
import {BookWeekStore} from '@features/book/state/book.week.store';
import {BookWeek, BookWeekId} from '@features/book/models/book.week.model';
import {PaginationConverter} from '@core/http/pagination.converter';
import {HlmButton} from '@spartan-ng/helm/button';
import {CommonModule} from '@angular/common';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {lucideTrash} from '@ng-icons/lucide';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'book-weeks-component',
  imports: [
    HlmButton,
    CommonModule,
    NgIcon,
    FormsModule
  ],
  providers: [provideIcons({lucideTrash})],
  template: `
    <div class="flex flex-col h-full gap-4 overflow-hidden">
      <div class="overflow-auto border rounded-md flex-1">
        <table class="w-full border-collapse text-sm">
          <thead class="sticky top-0 bg-gray-100 border-b">
          <tr>
            <th class="px-4 py-2 text-left font-medium">Kalenderwoche</th>
            <th class="px-4 py-2 text-left font-medium">Abgenommen</th>
            <th class="px-4 py-2 text-left font-medium">Aktionen</th>
          </tr>
          </thead>
          <tbody>
            @for (week of this.bookWeeks(); track week.id; let idx = $index) {
              <tr class="border-b hover:bg-gray-50 transition" [class.bg-gray-50]="idx % 2 === 0">
                <td class="px-4 py-3">{{ week.calendarWeek }} - {{ week.year }}</td>
                <td class="px-4 py-3">
                  @if (week.signedFromTrainer != null) {
                    {{ week.signedFromTrainer.forename }} {{ week.signedFromTrainer.surname }}
                  } @else {
                    <span class="text-gray-500">Nicht abgenommen</span>
                  }
                </td>
                <td class="px-4 py-3">
                  <button
                    hlmBtn
                    variant="destructive"
                    size="sm"
                    (click)="deleteWeek(week.id)"
                  >
                    <ng-icon name="lucideTrash" class="w-4 h-4"/>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="3" class="px-4 py-8 text-center text-gray-500">
                  Keine Wochen gefunden
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md border gap-4">
        <select
          class="border rounded-md px-2 py-1 text-sm"
          [ngModel]="rowsPerPage"
          (ngModelChange)="pageChange({first: 0, rows: $event})">
          @for (size of [5, 10, 20, 50]; track size) {
            <option [value]="size">{{ size }} pro Seite</option>
          }
        </select>
        <span class="text-sm text-gray-600 whitespace-nowrap">
          Zeige {{ first() + 1 }} bis {{ Math.min(first() + rowsPerPage, totalRecords()) }} von {{ totalRecords() }}
          Einträgen
        </span>
        <div class="flex gap-2">
          <button hlmBtn variant="outline" size="sm" [disabled]="first() === 0" (click)="previousPage()">
            Zurück
          </button>
          <button hlmBtn variant="outline" size="sm" [disabled]="first() + rowsPerPage >= totalRecords()"
                  (click)="nextPage()">
            Weiter
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Area -->
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
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `
})
export class BookWeeksComponent {

  protected readonly bookWeeks = signal<BookWeek[]>([]);
  protected readonly first = signal(0);
  protected readonly totalRecords = signal(0);
  protected readonly notification = signal<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  protected readonly Math = Math;
  private readonly rowsPerPageValue = signal(20);
  private readonly bookStore = inject(BookStore);
  private readonly bookWeekStore = inject(BookWeekStore);

  constructor() {

    effect(() => {
      const bookId = this.bookStore.activeBook().id;

      if (bookId != undefined) {

        const pageable = PaginationConverter.fromSkipTake(untracked(() => this.first()), untracked(() => this.rowsPerPageValue()));

        this.bookWeekStore.getWeeks(bookId, pageable.page, pageable.size).subscribe(value => {

          console.log("Fetched weeks for book", bookId, ":", value);

          if (value) {
            this.bookWeeks.set(value.content);
            this.totalRecords.set(value.page.totalElements);

            const toSkipTake = PaginationConverter.toSkipTake(value.page.number, pageable.size);
            this.first.set(toSkipTake.skip);
          }
        });

      }
    });

  }

  protected get rowsPerPage() {
    return this.rowsPerPageValue();
  }

  protected set rowsPerPage(v) {
    this.rowsPerPageValue.set(v);
  }

  protected pageChange($event: any) {
    const rows = $event.rows || this.rowsPerPageValue();
    const skip = $event.first || 0;
    const pageable = PaginationConverter.fromSkipTake(skip, rows);
    this.bookWeekStore.getWeeks(this.bookStore.activeBook().id, pageable.page, pageable.size).subscribe(value => {
      if (value) {
        this.bookWeeks.set(value.content);
        this.totalRecords.set(value.page.totalElements);
        const toSkipTake = PaginationConverter.toSkipTake(value.page.number, rows);
        this.first.set(toSkipTake.skip);
        this.rowsPerPageValue.set(rows);
      }
    });
  }

  protected previousPage() {
    const newFirst = Math.max(0, this.first() - this.rowsPerPageValue());
    this.pageChange({first: newFirst, rows: this.rowsPerPageValue()});
  }

  protected nextPage() {
    if (this.first() + this.rowsPerPageValue() < this.totalRecords()) {
      this.pageChange({first: this.first() + this.rowsPerPageValue(), rows: this.rowsPerPageValue()});
    }
  }

  protected showNotification(message: string, type: 'success' | 'error' | 'info') {
    this.notification.set({message, type});
    setTimeout(() => this.notification.set(null), 3000);
  }

  protected deleteWeek(id: BookWeekId) {
    if (!confirm('Möchten Sie diese Woche wirklich löschen?')) {
      this.showNotification('Löschen abgebrochen', 'info');
      return;
    }

    this.bookWeekStore.deleteWeek(id).subscribe({
      next: () => {
        this.showNotification('Woche erfolgreich gelöscht', 'success');
        this.pageChange({first: this.first(), rows: this.rowsPerPageValue()});
      },
      error: () => {
        this.showNotification('Die Woche kann nicht gelöscht werden!', 'error');
      }
    });
  }
}
