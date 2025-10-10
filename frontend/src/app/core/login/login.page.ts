import {Component} from '@angular/core';
import {AppFloatingConfigurator} from '@core/layout/component/app.floatingconfigurator';
import {Password} from 'primeng/password';
import {Checkbox} from 'primeng/checkbox';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'login-page',
  template: `
    <app-floating-configurator/>
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

            <div>
              <label for="email1"
                     class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
              <input pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-120 mb-8"/>

              <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
              <p-password id="password1" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true"
                          [feedback]="false"></p-password>

              <div class="flex items-center justify-end mt-2 mb-8 gap-8">
                <span
                  class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
              </div>
              <p-button label="Sign In" styleClass="w-full" routerLink="/"></p-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [
    AppFloatingConfigurator,
    Password,
    Checkbox,
    Button,
    InputText
  ],
  styles: `


  `
})
export class LoginPage {

}
