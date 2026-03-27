import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthenticationService} from '@core/auth/authentication.service';
import {Router} from '@angular/router';
import {UserStore} from '@core/users/state/user.store';
import {HlmButton} from '@spartan-ng/helm/button';

// @ts-ignore
// @ts-ignore
@Component({
  selector: 'login-page',
  template: `
    <div
      class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
      <div class="flex flex-col items-center justify-center">
        <div
          style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, purple 10%, rgba(33, 150, 243, 0) 30%)">
          <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
            <div class="text-center mb-8">
              <h1>RECORDBOOK</h1>
              <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Berichtsheft</div>
              <span class="text-muted-color font-medium">Sign in to continue</span>
            </div>

            <form [formGroup]="this.formGroup()" (submit)="login()">
              <label for="email1"
                     class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
              <input class="w-full md:w-120 mb-8 border rounded-md h-9 px-3" formControlName="email" id="email1"
                     placeholder="Email address" type="text"/>

              <label class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2" for="password1">Password</label>
              <input
                class="w-full mb-4 border rounded-md h-9 px-3"
                formControlName="password"
                id="password1"
                placeholder="Password"
                type="password"/>

              <div class="flex items-center justify-end mt-2 mb-8 gap-8">
                <span
                  class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
              </div>
              <button
                hlmBtn
                type="submit"
                class="w-full"
                [disabled]="!this.formGroup().valid">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [
    ReactiveFormsModule,
    HlmButton
  ]
})
export class LoginPage {

  protected readonly formGroup = signal(new FormGroup({
    email: new FormControl<string | null>(null, Validators.compose([
      Validators.required,
      Validators.email
    ])),
    password: new FormControl<string | null>(null, Validators.compose([
      Validators.required
    ]))
  }));
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly userStore = inject(UserStore);

  protected async login() {

    let value = this.formGroup().value;

    if (!value.email || !value.password) {
      return;
    }

    console.log("Logging in with", value.email);
    this.authenticationService.login(value.email, value.password).then(success => {

      if (success) {
        this.router.navigate(['/']).then();
        this.userStore.retrieveActiveUser();
      }

    });

  }

}
