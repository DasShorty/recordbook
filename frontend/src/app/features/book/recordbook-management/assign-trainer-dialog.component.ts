import {Component, ChangeDetectionStrategy, inject, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {AdminUserStore} from '@core/users/state/admin.user.store';
import {BookStore} from '@features/book/state/book.store';

interface DialogData {
  bookId: string;
}

@Component({
  selector: 'app-assign-trainer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>Assign Trainer</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Select Trainer</mat-label>
          <mat-select formControlName="trainerId" required>
            @for (trainer of getTrainers(); track trainer.id) {
              <mat-option [value]="trainer.id">
                {{ trainer.forename }} {{ trainer.surname }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onAssign()"
        [disabled]="form.invalid">
        Assign
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
export class AssignTrainerDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AssignTrainerDialogComponent>);
  private readonly bookStore = inject(BookStore);
  private readonly adminUserStore = inject(AdminUserStore);

  protected readonly data: DialogData = inject(MAT_DIALOG_DATA)

  form = this.fb.group({
    trainerId: ['', Validators.required],
  });

  getTrainers() {
    const users = this.adminUserStore.users();
    return users.content?.filter(u => u.userType === 'TRAINER') || [];
  }

  onAssign() {
    if (this.form.valid && this.data?.bookId) {
      const trainerId = this.form.get('trainerId')?.value;
      this.bookStore.updateTrainer(this.data.bookId, trainerId!, (result) => {
        if (result.ok) {
          this.dialogRef.close(result.data);
        } else {
          alert('Failed to assign trainer');
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}



