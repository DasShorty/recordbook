import {Component, inject, OnInit, signal, ChangeDetectionStrategy} from '@angular/core';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {BookStore} from '@features/book/state/book.store';
import {BookCreateComponent} from '@features/book/components/manager/book.create.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Book} from '@features/book/models/book.model';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'book-manager-list',
  imports: [
    TableModule,
    Button,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
          <th>Azubi</th>
          <th>Ausbildungskraft</th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-book>
        <tr>
          <td>{{ book.trainee.forename }} {{ book.trainee.surname }}</td>
          <td>{{ book.trainer.forename }} {{ book.trainer.surname }}</td>
          <td>
            <a [routerLink]="'/record-book/manage/view/' + book.id">
              <i class="pi pi-eye"></i>
            </a>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class BookManagerListComponent implements OnInit {

  readonly loading = signal(false);
  readonly error = signal(false);
  readonly dialogService = inject(DialogService);
  readonly bookManagerStore = inject(BookStore);
  private readonly dialogRef = signal<DynamicDialogRef | null>(null);
  private readonly router = inject(Router);

  ngOnInit() {
    this.loadBooks();
  }

  protected openDialog() {
    this.dialogRef.set(this.dialogService.open(BookCreateComponent, {
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
