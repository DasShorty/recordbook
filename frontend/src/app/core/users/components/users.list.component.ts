import {Component, inject, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {AdvancedUser} from '@core/users/models/users.model';
import {AdminUserStore} from '@core/users/state/admin.user.store';

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
export class UsersListComponent implements OnInit {

  readonly userStore = inject(AdminUserStore);

  ngOnInit() {

    this.userStore.getUsers(this.userStore.limit(), this.userStore.offset()).then();

  }

  deleteItem(user: AdvancedUser, $event: Event) {

  }

}
