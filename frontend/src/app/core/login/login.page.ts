import {Component} from '@angular/core';

@Component({
  selector: 'login-page',
  template: `
    <form>
      <p>Test</p>
    </form>
  `,
  styles: `
    form {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100dvh;
      width: 100dvw;
    }
  `
})
export class LoginPage {

}
