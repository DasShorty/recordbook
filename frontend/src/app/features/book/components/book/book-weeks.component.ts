import {Component, effect, inject, signal, untracked} from '@angular/core';
import {BookStore} from '@features/book/state/book.store';
import {TableModule, TablePageEvent} from 'primeng/table';
import {Button} from 'primeng/button';
import {BookWeekStore} from '@features/book/state/book.week.store';
import {BookWeek, BookWeekId} from '@features/book/models/book.week.model';
import {PaginationConverter} from '@core/http/pagination.converter';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
  selector: 'book-weeks-component',
  imports: [
    TableModule,
    Button,
    Toast,
    ConfirmDialog
  ],
  template: `
    <p-table
      [scrollable]="true"
      scrollHeight="flex"
      [tableStyle]="{ 'width': '100%', 'height': '100%' }"
      [paginator]="true"
      [lazy]="true"
      [first]="this.first()"
      [rows]="this.rows()"
      [totalRecords]="this.totalRecords()"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Zeige {first} bis {last} von {totalRecords} Einträgen"
      (onPage)="pageChange($event)"
      [rowsPerPageOptions]="[5,10, 20, 50]"
      [value]="this.bookWeeks()">
      <ng-template #header>
        <tr>
          <th>Kalenderwoche</th>
          <th>Abgenommen</th>
          <th>Aktionen</th>
        </tr>
      </ng-template>
      <ng-template #body let-weeks>
        <tr>
          <td>{{ weeks.calendarWeek }} - {{ weeks.year }}</td>
          <td>
            @if (weeks.signedFromTrainer != null) {
              {{ weeks.signedFromTrainer.forename }} {{ weeks.signedFromTrainer.surname }}
            } @else {
              Nicht abgenommen
            }
          </td>
          <td>
            <p-button (click)="deleteWeek(weeks.id, $event)" icon="pi pi-trash" severity="danger"/>
          </td>
        </tr>
      </ng-template>
    </p-table>
    <p-toast/>
    <p-confirm-dialog/>
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
  protected readonly rows = signal(20);
  protected readonly totalRecords = signal(0);
  private readonly bookStore = inject(BookStore);
  private readonly bookWeekStore = inject(BookWeekStore);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  constructor() {

    effect(() => {
      const bookId = this.bookStore.activeBook().id;

      if (bookId != undefined) {

        // Use untracked to prevent the effect from re-triggering when first/rows change
        const pageable = PaginationConverter.fromSkipTake(untracked(this.first), untracked(this.rows));

        this.bookWeekStore.getWeeks(bookId, pageable.page, pageable.size).subscribe(value => {

          console.log("Fetched weeks for book", bookId, ":", value);

          if (value) {
            this.bookWeeks.set(value.content);
            this.totalRecords.set(value.page.totalElements);

            // Update first (skip) based on the response, but keep rows as requested
            const toSkipTake = PaginationConverter.toSkipTake(value.page.number, pageable.size);
            this.first.set(toSkipTake.skip);
          }
        });

      }
    });

  }

  protected pageChange($event: TablePageEvent) {

    const rows = $event.rows;
    const skip = $event.first;

    console.log("Page change event:", $event);

    const pageable = PaginationConverter.fromSkipTake(skip, rows);

    this.bookWeekStore.getWeeks(this.bookStore.activeBook().id, pageable.page, pageable.size).subscribe(value => {

      if (value) {
        this.bookWeeks.set(value.content);
        this.totalRecords.set(value.page.totalElements);

        // Update first (skip) based on the response, but keep rows as user selected
        const toSkipTake = PaginationConverter.toSkipTake(value.page.number, rows);
        this.first.set(toSkipTake.skip);
        this.rows.set(rows);
      }
    });
  }

  protected deleteWeek(id: BookWeekId, event: Event) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Möchten Sie diese Woche wirklich löschen?',
      header: 'Bestätigung',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Abbrechen',
      rejectButtonProps: {
        label: 'Abbrechen',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Löschen',
        severity: 'danger'
      },
      accept: () => {
        this.bookWeekStore.deleteWeek(id).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Erfolg', detail: 'Woche erfolgreich gelöscht'});
            // Trigger a refresh of the weeks list
            this.pageChange({first: this.first(), rows: this.rows()} as TablePageEvent);
          },
          error: () => {
            this.messageService.add({severity: 'error', summary: 'Fehler', detail: 'Die Woche kann nicht gelöscht werden!'});
          }
        });
      },
      reject: () => {
          this.messageService.add({severity: 'info', summary: 'Abgebrochen', detail: 'Löschen der Woche abgebrochen'});
      }
    })

  }
}
