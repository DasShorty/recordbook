import {Component} from '@angular/core';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';

@Component({
  selector: 'record-book-manager-list-component',
  imports: [
    TableModule,
    Button
  ],
  template: `
    <p-table>
      <ng-template #caption>
        <div class="flex items-center justify-between">
          <span class="text-xl font-bold">Berichtshefte</span>
          <p-button severity="success" outlined icon="pi pi-plus"
                    label="Berichtsheft anlegen"/>
        </div>
      </ng-template>
    </p-table>
  `
})
export class RecordBookManagerListComponent {
}
