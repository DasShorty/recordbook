import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {LoginFormComponent} from '@core/users/components/login-form.component';

@Component({
  selector: 'login-page',
  template: `
    <div class="flex justify-center items-center h-dvh">
      <login-form-component></login-form-component>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    LoginFormComponent
  ]
})
export default class LoginPage {

}
