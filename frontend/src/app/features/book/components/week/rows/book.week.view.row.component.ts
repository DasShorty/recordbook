import {ChangeDetectionStrategy, Component, inject, input,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookDay} from '@features/book/models/book.day.model';
import {Presence, PresenceDisplay, PresenceType,} from '@features/book/models/presence.type';
import {DateFormatService} from '@features/book/services/date.format.service';

@Component({
  selector: '[book-week-view-row]',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.weekend]': 'dateFormatService.isWeekend(bookDay().date)',
    'class': 'view-row'
  },
  template: `
    <td class="px-2 py-1">
      <div class="flex flex-col">
        <span class="font-medium">{{
            dateFormatService.getWeekdayName(bookDay().date)
          }}</span>
        <span class="text-sm text-gray-600">{{
            dateFormatService.formatDate(bookDay().date)
          }}</span>
      </div>
    </td>

    <td class="px-2 py-1">
      <p>{{ getPresenceDisplay(bookDay().presence) }}</p>
    </td>

    <td class="px-2 py-1">
      <p>{{ getPresenceTypeDisplay(bookDay().presenceLocation) }}</p>
    </td>

    <td class="px-2 py-1 text-right">
      <p>{{ bookDay().hours }}h {{ bookDay().minutes }}min</p>
    </td>
  `,
  styles: [
    `
      :host.weekend {
        background-color: rgba(0, 0, 0, 0.03);
      }

      :host td {
        padding: 0.5rem;
      }

      :host p {
        margin: 0;
      }
    `,
  ],
})
export class BookWeekViewRowComponent {
  public readonly bookDay = input.required<BookDay>();

  protected readonly dateFormatService = inject(DateFormatService);

  protected getPresenceDisplay(presence: Presence | null): string {
    if (!presence) {
      return '—';
    }
    return PresenceDisplay.getPresenceDisplay(presence);
  }

  protected getPresenceTypeDisplay(presenceType: PresenceType | null): string {
    if (!presenceType) {
      return '—';
    }
    return PresenceDisplay.getPresenceType(presenceType);
  }
}
