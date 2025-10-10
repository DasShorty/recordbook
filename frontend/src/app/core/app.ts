import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root', imports: [ReactiveFormsModule, RouterOutlet], template: `
    <router-outlet></router-outlet>
  `,
})
export class App {
}
