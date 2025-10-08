import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Button],
  template: `
    <p>Test</p>

    <p-button label="Check"/>
  `
})
export class App {
  protected readonly title = signal('frontend');
}
