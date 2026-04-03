import {Component, ChangeDetectionStrategy, inject, Inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {BookTrainerStore} from '@features/book/state/book.trainer.store';
import {BookWeek, BookWeekId} from '@features/book/models/book.week.model';

interface DialogData {
  weekId: string;
  action: 'accept' | 'deny';
}

@Component({
  selector: 'app-approval-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <h2 mat-dialog-title>
      @if (data.action === 'accept') {
        Accept Week
      } @else {
        Deny Week
      }
    </h2>

    <mat-dialog-content>
      <form [formGroup]="form">
        @if (data.action === 'deny') {
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Reason for Denial (optional)</mat-label>
            <textarea
              matInput
              formControlName="reason"
              rows="4"
              placeholder="Provide feedback for the trainee..."></textarea>
          </mat-form-field>
        } @else {
          <p>Are you sure you want to accept this week?</p>
        }
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" [disabled]="isLoading()">Cancel</button>
      <button
        mat-raised-button
        [color]="data.action === 'accept' ? 'accent' : 'warn'"
        (click)="onConfirm()"
        [disabled]="isLoading()">
        @if (isLoading()) {
          <mat-spinner diameter="20"></mat-spinner>
        } @else {
          @if (data.action === 'accept') {
            <mat-icon>check_circle</mat-icon>
            Accept
          } @else {
            <mat-icon>cancel</mat-icon>
            Deny
          }
        }
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

    button[disabled] {
      opacity: 0.5;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApprovalDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ApprovalDialogComponent>);
  private readonly trainerStore = inject(BookTrainerStore);

  protected readonly data: DialogData = inject(MAT_DIALOG_DATA)

  isLoading = signal(false);

  form = this.fb.group({
    reason: [''],
  });

  onConfirm() {
    if (this.data.action === 'accept') {
      this.isLoading.set(true);
      this.trainerStore.acceptWeek(this.data.weekId as BookWeekId, (result) => {
        this.isLoading.set(false);
        if (result.ok) {
          this.dialogRef.close(true);
        } else {
          alert('Failed to accept week');
        }
      });
    } else {
      this.isLoading.set(true);
      this.trainerStore.denyWeek(this.data.weekId as BookWeekId, (result) => {
        this.isLoading.set(false);
        if (result.ok) {
          this.dialogRef.close(true);
        } else {
          alert('Failed to deny week');
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

