import {ChangeDetectionStrategy, Component} from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';

@Component({
  selector: 'login-form-component',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardFooter,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule
  ],
  template: `
    <mat-card appearance="outlined">

      <mat-card-header>
        <mat-card-title>Berichtsheft</mat-card-title>
        <mat-card-subtitle>Recordbook v2.0 - Berichtsheftsoftware</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <form id="login-form" [formGroup]="form">
          <mat-form-field>
            <mat-label>E-Mail</mat-label>
            <input matInput formControlName="email" placeholder="max.mustermann@domain.tld">
          </mat-form-field>
          <mat-form-field>
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" type="password" placeholder="1234">
          </mat-form-field>
        </form>
      </mat-card-content>

      <mat-card-footer>
        <button matButton form="login-form">Login</button>
      </mat-card-footer>

    </mat-card>
  `,
  styles: `
    form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;

      mat-form-field {
        width: 100%;
      }
    }

    mat-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {

  protected readonly form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
}
