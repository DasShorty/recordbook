import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {UserStore} from '@shared/users/user.store';
import {AdvancedUser} from '@shared/users/users.model';

@Component({
  selector: 'users-list-component',
  imports: [
    Button,
    ConfirmDialog,
    TableModule,
    Toast
  ],
  template: `
    <p-toast/>
    <p-confirm-dialog/>
    <p-table [value]="this.userStore.users()">
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

  readonly userStore = inject(UserStore);

  deleteItem(user: AdvancedUser, $event: Event) {

  }

}
