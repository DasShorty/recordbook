import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {AdminUserStore} from '@core/users/state/admin.user.store';
import {CreateUserDialogComponent} from './create-user-dialog.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>User Administration</mat-card-title>
          <button
            mat-raised-button
            color="primary"
            (click)="openCreateUserDialog()"
            class="create-btn">
            <mat-icon>add</mat-icon>
            New User
          </button>
        </mat-card-header>

        <mat-card-content>
          @if (adminUserStore.users().content) {
            <table mat-table [dataSource]="adminUserStore.users().content" class="users-table">
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let element">{{ element.id }}</td>
              </ng-container>

              <!-- Forename Column -->
              <ng-container matColumnDef="forename">
                <th mat-header-cell *matHeaderCellDef>Forename</th>
                <td mat-cell *matCellDef="let element">{{ element.forename }}</td>
              </ng-container>

              <!-- Surname Column -->
              <ng-container matColumnDef="surname">
                <th mat-header-cell *matHeaderCellDef>Surname</th>
                <td mat-cell *matCellDef="let element">{{ element.surname }}</td>
              </ng-container>

              <!-- User Type Column -->
              <ng-container matColumnDef="userType">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let element">{{ element.userType }}</td>
              </ng-container>

              <!-- Authority Column -->
              <ng-container matColumnDef="authority">
                <th mat-header-cell *matHeaderCellDef>Authority</th>
                <td mat-cell *matCellDef="let element">{{ element.authority }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef>
                  <button mat-icon-button color="warn" (click)="deleteUser($event)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let element; columns: displayedColumns;"></tr>
            </table>
          } @else {
            <p class="no-data">No users found</p>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .create-btn {
      margin-left: auto;
    }

    .users-table {
      width: 100%;
      margin-top: 16px;
    }

    .no-data {
      text-align: center;
      padding: 24px;
      color: #999;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class UsersPage {
  readonly adminUserStore = inject(AdminUserStore);
  private readonly dialog = inject(MatDialog);

  displayedColumns = ['id', 'forename', 'surname', 'userType', 'authority', 'actions'];

  constructor() {
    this.adminUserStore.getUsers(20, 0);
  }

  openCreateUserDialog() {
    this.dialog.open(CreateUserDialogComponent, {
      width: '500px',
    });
  }

  deleteUser(event: Event) {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this user?')) {
      // TODO: Implement delete functionality when backend endpoint is available
      alert('Delete functionality coming soon');
    }
  }
}


