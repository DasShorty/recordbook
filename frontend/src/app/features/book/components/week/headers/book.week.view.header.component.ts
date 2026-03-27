import {ChangeDetectionStrategy, Component, input, output,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {HlmButton} from '@spartan-ng/helm/button';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {lucideChevronLeft, lucideChevronRight} from '@ng-icons/lucide';

@Component({
  selector: 'book-week-view-header',
  standalone: true,
  imports: [CommonModule, RouterLink, HlmButton, NgIcon],
  providers: [provideIcons({lucideChevronLeft, lucideChevronRight})],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="header-container">
      <div class="navigation-buttons">
        <button
          hlmBtn
          variant="ghost"
          size="icon"
          [queryParams]="previousWeekParams()"
          [routerLink]="routerLinkBase()"
          aria-label="Vorherige Woche"
        >
          <ng-icon name="lucideChevronLeft"/>
        </button>
        <button
          hlmBtn
          variant="ghost"
          size="icon"
          [queryParams]="nextWeekParams()"
          [routerLink]="routerLinkBase()"
          aria-label="Nächste Woche"
        >
          <ng-icon name="lucideChevronRight"/>
        </button>
      </div>

      <div class="week-info">
        <h2 class="text-xl font-bold">
          Woche {{ year() }}/{{ calendarWeek() }}
        </h2>
      </div>

      <div class="action-buttons gap-2">
        <button
          hlmBtn
          (click)="onSign.emit()"
          [disabled]="isSigned() || !isLocked()"
          aria-label="Woche akzeptieren"
        >
          {{
            isLoading()
              ? 'Speichern...'
              : isSigned()
                ? 'Woche akzeptiert'
                : 'Woche akzeptieren'
          }}
        </button>
        @if (!isSigned()) {
          <button
            hlmBtn
            (click)="onDeny.emit()"
            [disabled]="!isLocked()"
            aria-label="Woche ablehnen"
          >
            {{ isLoading() ? 'Speichern...' : 'Woche ablehnen' }}
          </button>
        }
      </div>
    </div>

    @if (error()) {
      <div class="error-message mt-4">
        <p class="text-red-600 font-medium">{{ error() }}</p>
      </div>
    }
  `,
  styles: [
    `
      .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
        background-color: #fafbfc;
      }

      .navigation-buttons {
        display: flex;
        gap: 0.5rem;
      }

      .week-info {
        flex: 1;
        text-align: center;
      }


      .error-message {
        padding: 0.75rem 1rem;
        background-color: #fee2e2;
        border-left: 4px solid #dc2626;
        border-radius: 0.375rem;
      }
    `,
  ],
})
export class BookWeekViewHeaderComponent {
  public readonly calendarWeek = input.required<number>();
  public readonly year = input.required<number>();
  public readonly isSigned = input.required<boolean>();
  public readonly isLocked = input.required<boolean>();
  public readonly isLoading = input.required<boolean>();
  public readonly error = input<string | null>(null);
  public readonly previousWeekParams = input.required<Record<string, number>>();
  public readonly nextWeekParams = input.required<Record<string, number>>();
  public readonly routerLinkBase = input.required<string>();

  public readonly onSign = output<void>();
  public readonly onDeny = output<void>();
}
