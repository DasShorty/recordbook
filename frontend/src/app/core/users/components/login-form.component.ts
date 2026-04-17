import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {MatFormField, MatInput, MatLabel, MatError} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {AuthenticationService} from '@core/auth/authentication.service';
import {Router} from '@angular/router';
import {UserStore} from '@core/users/state/user.store';

@Component({
  selector: 'login-form-component',
  standalone: true,
  imports: [
    CommonModule,
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
    MatError,
    MatIcon,
    MatProgressSpinner,
    ReactiveFormsModule
  ],
  template: `
    <mat-card appearance="outlined">

      <mat-card-header>
        <mat-card-title>Berichtsheft</mat-card-title>
        <mat-card-subtitle>Recordbook v2.0 - Berichtsheftsoftware</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        @if (errorMessage()) {
          <div class="error-banner">
            <mat-icon>error</mat-icon>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <form id="login-form" [formGroup]="form" (ngSubmit)="onLogin()">
          <mat-form-field>
            <mat-label>E-Mail</mat-label>
            <input
              matInput
              formControlName="email"
              placeholder="max.mustermann@domain.tld"
              [disabled]="isLoading()">
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <mat-error>Bitte geben Sie eine gültige E-Mail-Adresse ein</mat-error>
            }
          </mat-form-field>

          <mat-form-field>
            <mat-label>Passwort</mat-label>
            <input
              matInput
              formControlName="password"
              type="password"
              placeholder="Passwort"
              [disabled]="isLoading()">
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
              <mat-error>Passwort ist erforderlich</mat-error>
            }
          </mat-form-field>
        </form>
      </mat-card-content>

      <mat-card-footer>
        @if (isLoading()) {
          <button
            mat-raised-button
            color="primary"
            form="login-form"
            type="submit"
            class="align-with-text"
            [disabled]="form.invalid || isLoading()">
            <mat-spinner diameter="20"></mat-spinner>
            <span>Anmelden wird durchgeführt...</span>
          </button>
        } @else {
          <button
            mat-raised-button
            color="primary"
            form="login-form"
            type="submit"
            class="align-with-text"
            [disabled]="form.invalid || isLoading()">
            <mat-icon>login</mat-icon>
            <span>Anmelden</span>
          </button>
        }
      </mat-card-footer>

    </mat-card>
  `,
  styles: `
    :host {
      display: block;
    }

    form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      gap: 1rem;

      mat-form-field {
        width: 100%;
      }
    }

    mat-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      max-width: 400px;
    }

    mat-card-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 0.5rem 1rem;
      border-top: 1px solid rgba(0, 0, 0, 0.12);

      button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 120px;
      }
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 12px 16px;
      background-color: #ffebee;
      border-left: 4px solid #d32f2f;
      border-radius: 4px;
      color: #c62828;
      margin-bottom: 1rem;

      mat-icon {
        color: #d32f2f;
      }
    }

    mat-spinner {
      display: inline-block;
      margin-right: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
  private readonly authService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly userStore = inject(UserStore);

  isLoading = signal(false);
  errorMessage = signal('');

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  async onLogin() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const email = this.form.get('email')?.value || '';
      const password = this.form.get('password')?.value || '';

      const success = await this.authService.login(email, password);

      if (success) {
        // Retrieve and store current user information
        this.userStore.retrieveActiveUser();

        // Navigate to home page
        await this.router.navigate(['/']);
      } else {
        this.errorMessage.set('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage.set('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
