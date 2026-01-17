import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {BookStore} from '@features/book/state/book.store';
import {BookCreateComponent} from '@features/book/components/manager/book.create.component';
import {TrainerSwapDialogComponent} from '@features/book/components/manager/trainer.swap.dialog';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'book-manager-list',
  imports: [
    TableModule,
    Button,
    RouterLink,
    CommonModule,
    Ripple
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
        </tr>
      </ng-template>
      <ng-template #body let-book>
        <tr [routerLink]="'/record-book/manage/view/' + book.id">
          <td>{{ book.trainee.forename }} {{ book.trainee.surname }}</td>
          <td class="flex items-center">
            <span>{{ book.trainer.forename }} {{ book.trainer.surname }}</span>
            <p-button
              (click)="openTrainerSwapDialog($event, book)"
              icon="pi pi-pencil"
              [rounded]="true"
              [text]="true"
              [plain]="true"
              severity="info"
              [loading]="false"
              pRipple/>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: `
    tr:hover {
      background-color: var(--color-gray-100);
      cursor: pointer;
    }
  `
})
export class BookManagerListComponent implements OnInit {

  readonly loading = signal(false);
  readonly error = signal(false);
  readonly dialogService = inject(DialogService);
  readonly bookManagerStore = inject(BookStore);
  private readonly dialogRef = signal<DynamicDialogRef | null>(null);

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

  protected openTrainerSwapDialog(event: Event, book: any) {
    event.stopPropagation();

    this.dialogRef.set(this.dialogService.open(TrainerSwapDialogComponent, {
      appendTo: 'body',
      header: 'Ausbildungskraft ändern',
      width: '50vw',
      modal: true,
      contentStyle: {overflow: 'auto'},
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      data: {
        bookId: book.id,
        currentTrainer: book.trainer
      }
    }));
  }

  private loadBooks() {
    this.loading.set(true);
    this.bookManagerStore.loadBooks(0, 20, (success) => {
      this.loading.set(false);
      this.error.set(!success);
    });
  }

}
