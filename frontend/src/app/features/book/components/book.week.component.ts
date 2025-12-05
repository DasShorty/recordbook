import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookWeek} from '@features/book/models/book.week.model';
import {BookWeekContentComponent} from '@features/book/components/book.week.content.component';

@Component({
  selector: 'book-week-component',
  imports: [CommonModule, BookWeekContentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="book-week">
      <book-week-content [bookWeek]="bookWeek()" (weekSaved)="onWeekSaved($event)"></book-week-content>
    </div>
  `,
})
export class BookWeekComponent {
  public readonly bookWeek = input.required<BookWeek>();

  // parent can handle the saved week; for now we just log
  onWeekSaved(updated: BookWeek) {
    console.log('Week saved:', updated);
  }
}
