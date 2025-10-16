import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'box-component',
  template: `
    <div class="rounded-md bg-gray-100">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxComponent {
}
