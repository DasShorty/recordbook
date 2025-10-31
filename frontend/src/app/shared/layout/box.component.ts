import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'box-component',
  template: `
    <div style="padding: 1rem;" class="rounded-md bg-white">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxComponent {
}
