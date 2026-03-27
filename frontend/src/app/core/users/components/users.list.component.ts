import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {AdminUserStore} from '@core/users/state/admin.user.store';
import {HlmTableImports} from '@spartan-ng/helm/table';
import {HlmPaginationImports} from '@spartan-ng/helm/pagination';

@Component({
  selector: 'users-list-component',
  imports: [
    HlmTableImports,
    HlmPaginationImports

  ],
  template: `

    <div hlmTableContainer>
      <table hlmTable>
        <caption hlmCaption>A list of users</caption>
        <thead hlmTHead>
        <tr hlmTr>
          <th hlmTh>Vorname</th>
          <th hlmTh>Nachname</th>
          <th hlmTh>Typ</th>
        </tr>
        </thead>
        <tbody hlmTBody>
          @for (user of this.users(); track user.id) {
            <tr hlmTr>
              <td hlmTd>{{ user.forename }}</td>
              <td hlmTd>{{ user.surname }}</td>
              <td hlmTd>{{ user.userType }}</td>
            </tr>
          }
        </tbody>
        <tfoot hlmTFoot>
        <hlm-numbered-pagination (currentPageChange)="changeCurrentPage($event)" [(currentPage)]="this.currentPage"
                                 [(itemsPerPage)]="this.pageSize"
                                 [totalItems]="this.totalSize()"></hlm-numbered-pagination>
        </tfoot>
      </table>
    </div>
  `,
  styles: `
    tr:hover {
      background-color: var(--color-gray-100);
    }
  `
})
export class UsersListComponent implements OnInit {

  public readonly currentPage = signal(0);
  public readonly pageSize = signal(20);
  public readonly totalSize = signal(0);
  private readonly userStore = inject(AdminUserStore);
  public readonly users = computed(() => this.userStore.users().content);

  ngOnInit() {
    this.loadPage();
  }

  loadPage() {
    this.userStore.getUsers(this.pageSize(), this.currentPage());
  }

  protected changeCurrentPage(newPage: number) {
    this.userStore.getUsers(this.pageSize(), newPage);
  }
}
