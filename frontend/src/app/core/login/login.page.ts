import {Component, computed, inject} from '@angular/core';
import {Password} from 'primeng/password';
import {InputText} from 'primeng/inputtext';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Button} from 'primeng/button';
import {AuthenticationService} from '@shared/authentication/authentication.service';
import {Router, RouterLink} from '@angular/router';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';


@Component({
  selector: 'login-page',
  template: `
    <div
      class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
      <div class="flex flex-col items-center justify-center">
        <div
          style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
          <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
            <div class="text-center mb-8">
              <h1>RECORDBOOK</h1>
              <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Berichtsheft</div>
              <span class="text-muted-color font-medium">Sign in to continue</span>
            </div>

            <form [formGroup]="this.formGroup()" (submit)="login()">
              <label for="email1"
                     class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
              <input class="w-full md:w-120 mb-8" formControlName="email" id="email1" pInputText
                     placeholder="Email address" type="text"/>

              <label class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2" for="password1">Password</label>
              <p-password [feedback]="false"
                          [fluid]="true"
                          [toggleMask]="true"
                          formControlName="password"
                          id="password1"
                          placeholder="Password"
                          styleClass="mb-4"></p-password>

              <div class="flex items-center justify-end mt-2 mb-8 gap-8">
                <span
                  class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
              </div>
              <p-button type="submit" label="Sign In" [disabled]="!this.formGroup().valid" styleClass="w-full"
                        routerLink="/"></p-button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="card flex justify-center gap-2">
      <p-toast/>
    </div>
  `,
  imports: [
    Password,
    InputText,
    ReactiveFormsModule,
    Button,
    Toast,
    RouterLink
  ]
})
export class LoginPage {

  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  protected formGroup = computed(() => {
    return new FormGroup({
      email: new FormControl<string | null>(null, Validators.compose([
        Validators.required,
        Validators.email
      ])),
      password: new FormControl<string | null>(null, Validators.compose([
        Validators.required
      ]))
    });
  });

  protected async login() {

    let value = this.formGroup().value;

    if (!value.email || !value.password) {
      return;
    }

    try {
      const response = await this.authenticationService.login(value.email, value.password);

      if (response && response.ok) {
        this.router.navigate(['']).then();
      } else {
        this.messageService.add({severity: 'error', summary: 'Invalid Credentials'});
      }
    } catch (e) {
      this.messageService.add({severity: 'error', summary: 'Invalid Credentials'});
    }

  }

}
