import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {AdminUserStore} from '@core/users/state/admin.user.store';
import {UserType} from '@core/users/models/users.model';
import {BookStore} from '@features/book/state/book.store';

@Component({
  selector: 'app-create-recordbook-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 mat-dialog-title>Create Recordbook</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="form-content">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Trainee</mat-label>
          <mat-select formControlName="traineeId" required>
            @for (trainee of trainees(); track trainee.id) {
              <mat-option [value]="trainee.id">
                {{ trainee.forename }} {{ trainee.surname }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Trainer</mat-label>
          <mat-select formControlName="trainerId" required>
            @for (trainer of trainers(); track trainer.id) {
              <mat-option [value]="trainer.id">
                {{ trainer.forename }} {{ trainer.surname }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" type="button" [disabled]="form.invalid" (click)="onCreate()">
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .form-content {
        padding-top: 8px;
      }

      .full-width {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateRecordbookDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateRecordbookDialogComponent>);
  private readonly adminUserStore = inject(AdminUserStore);
  private readonly bookStore = inject(BookStore);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly users = computed(() => this.adminUserStore.users().content ?? []);
  protected readonly trainees = computed(() => this.users().filter((user) => user.userType === UserType.TRAINEE));
  protected readonly trainers = computed(() => this.users().filter((user) => user.userType === UserType.TRAINER));

  protected readonly form = this.fb.group({
    traineeId: ['', Validators.required],
    trainerId: ['', Validators.required],
  });

  constructor() {
    this.adminUserStore.getUsers(200, 0);
  }

  protected onCancel() {
    this.dialogRef.close();
  }

  protected onCreate() {
    if (this.form.invalid) {
      return;
    }

    const traineeId = this.form.controls.traineeId.value;
    const trainerId = this.form.controls.trainerId.value;

    if (!traineeId || !trainerId) {
      return;
    }

    this.bookStore.createBook(traineeId, trainerId, (book) => {
      if (!book) {
        this.snackBar.open('Failed to create recordbook', 'Close', {duration: 3500});
        return;
      }

      this.dialogRef.close(book);
    });
  }
}

