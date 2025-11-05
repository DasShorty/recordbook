import {Component, inject, OnInit, signal} from '@angular/core';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {BookManagerStore} from '@features/book/state/book.manager.store';
import {RecordBookManagerDialog} from '@features/book/components/manager/record.book.manager.dialog';

@Component({
  selector: 'record-book-manager-list-component',
  imports: [
    TableModule,
    Button,
    RecordBookManagerDialog
  ],
  template: `
    <p-table>
      <ng-template #caption>
        <div class="flex items-center justify-between gap-1">
          <span class="text-xl font-bold">Berichtshefte</span>
          <p-button severity="success" (click)="dialog.toggleDialog()" outlined icon="pi pi-plus"
                    label="Berichtsheft anlegen"/>
          <record-book-manager-dialog #dialog></record-book-manager-dialog>
        </div>
      </ng-template>
    </p-table>
  `
})
export class RecordBookManagerListComponent implements OnInit {

  readonly loading = signal(false);
  readonly error = signal(false);
  private readonly bookManagerStore = inject(BookManagerStore);

  ngOnInit() {
    this.loadBooks();
  }

  private loadBooks() {
    this.loading.set(true);
    this.bookManagerStore.loadBooks(0, 10, (success) => {
      this.loading.set(false);
      this.error.set(!success);
    });
  }

}
