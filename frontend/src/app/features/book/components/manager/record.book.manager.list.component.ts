import {Component, inject, OnInit, signal} from '@angular/core';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {BookManagerStore} from '@features/book/state/book.manager.store';
import {CreateRecordBookComponent} from '@features/book/components/manager/create.record.book.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'record-book-manager-list-component',
  imports: [
    TableModule,
    Button
  ],
  template: `
    <p-table [value]="this.bookManagerStore.books()">
      <ng-template #caption>
        <div class="flex items-center justify-between gap-1">
          <span class="text-xl font-bold">Berichtshefte</span>
          <p-button severity="success" (click)="openDialog()" outlined icon="pi pi-plus"
                    label="Berichtsheft anlegen"/>
        </div>
      </ng-template>
      <ng-template #header>
        <tr>
          <th>Beruf</th>
          <th>Azubi</th>
          <th>Ausbildungskräfte</th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-book>
        <tr>
          <td>{{ book.job.name }}</td>
          <td>{{ book.trainee.forename }} {{ book.trainee.surname }}</td>
          <td>{{ book.trainee.forename }} {{ book.trainee.surname }}</td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class RecordBookManagerListComponent implements OnInit {

  readonly loading = signal(false);
  readonly error = signal(false);
  readonly dialogService = inject(DialogService);
  readonly bookManagerStore = inject(BookManagerStore);
  private readonly dialogRef = signal<DynamicDialogRef | null>(null);

  ngOnInit() {
    this.loadBooks();
  }

  openDialog() {
    this.dialogRef.set(this.dialogService.open(CreateRecordBookComponent, {
      appendTo: 'body',
      header: 'Berichtsheft erstellen',
      width: '50vw',
      modal: true,
      contentStyle: {overflow: 'auto'},
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    }));
  }

  private loadBooks() {
    this.loading.set(true);
    this.bookManagerStore.loadBooks(0, 10, (success) => {
      this.loading.set(false);
      this.error.set(!success);
    });
  }

}
