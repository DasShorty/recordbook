import {Component, effect, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {User} from '@core/users/models/users.model';
import {AdminUserStore} from '@core/users/state/admin.user.store';
import {UserAddButton} from '@core/users/components/user.add.button';

@Component({
  selector: 'users-list-component',
  imports: [
    Button,
    ConfirmDialog,
    TableModule,
    Toast,
    UserAddButton
  ],
  template: `
    <p-toast/>
    <p-confirm-dialog/>
    <p-table [value]="this.userStore.data().content">
      <ng-template #caption>
        <div class="flex items-center justify-between gap-1">
          <span class="text-xl font-bold">Benutzer verwalten</span>
          <user-add-button></user-add-button>
        </div>
      </ng-template>
      <ng-template #header>
        <tr>
          <th>Vorname</th>
          <th>Nachname</th>
          <th>Typ</th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-user>
        <tr>
          <td>{{ user.forename }}</td>
          <td>{{ user.surname }}</td>
          <td> {{ user.userType }}</td>
          <td>
            <p-button severity="danger" outlined icon="pi pi-trash" (onClick)="deleteItem(user, $event)"></p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class UsersListComponent {

  readonly userStore = inject(AdminUserStore);

  constructor() {
    effect(() => {
      this.userStore.getUsers();
    });
  }

  deleteItem(user: User, $event: Event) {

  }

}
