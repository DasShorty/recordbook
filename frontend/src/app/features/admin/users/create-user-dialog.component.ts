import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {AdminUserStore} from '@core/users/state/admin.user.store';
import {UserType, Authority} from '@core/users/models/users.model';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>Create New User</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Forename</mat-label>
          <input matInput formControlName="forename" required />
          @if (form.get('forename')?.invalid && form.get('forename')?.touched) {
            <mat-error>Forename is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Surname</mat-label>
          <input matInput formControlName="surname" required />
          @if (form.get('surname')?.invalid && form.get('surname')?.touched) {
            <mat-error>Surname is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>E-Mail</mat-label>
          <input matInput type="email" formControlName="email" required />
          @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
            <mat-error>E-Mail is required</mat-error>
          }
          @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
            <mat-error>Please provide a valid E-Mail address</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" required />
          @if (form.get('password')?.invalid && form.get('password')?.touched) {
            <mat-error>Password is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>User Type</mat-label>
          <mat-select formControlName="userType" required>
            <mat-option value="TRAINEE">Trainee</mat-option>
            <mat-option value="TRAINER">Trainer</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Authority</mat-label>
          <mat-select formControlName="authority" required>
            <mat-option value="TRAINEE">Trainee</mat-option>
            <mat-option value="TRAINER">Trainer</mat-option>
            <mat-option value="ADMINISTRATOR">Administrator</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onCreate()"
        [disabled]="form.invalid">
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-dialog-actions {
      margin-top: 24px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateUserDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);
  private readonly adminUserStore = inject(AdminUserStore);

  form = this.fb.group({
    forename: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    userType: ['TRAINEE', Validators.required],
    authority: ['TRAINEE', Validators.required],
  });

  onCreate() {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.adminUserStore.createUser({
        forename: formValue.forename!,
        surname: formValue.surname!,
        email: formValue.email!,
        password: formValue.password!,
        userType: formValue.userType as UserType,
        authority: formValue.authority as Authority,
      }, (user) => {
        if (user) {
          this.dialogRef.close(user);
          this.adminUserStore.getUsers(20, 0);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
