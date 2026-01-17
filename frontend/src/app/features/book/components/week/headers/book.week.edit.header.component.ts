import {ChangeDetectionStrategy, Component, input, output,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Button} from 'primeng/button';

@Component({
  selector: 'book-week-edit-header',
  standalone: true,
  imports: [CommonModule, RouterLink, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="header-container">
      <div class="navigation-buttons">
        <p-button
          [queryParams]="previousWeekParams()"
          routerLink="/record-book/week"
          icon="pi pi-chevron-left"
          [text]="true"
          [rounded]="true"
          ariaLabel="Vorherige Woche"
        ></p-button>
        <p-button
          [queryParams]="nextWeekParams()"
          routerLink="/record-book/week"
          icon="pi pi-chevron-right"
          [text]="true"
          [rounded]="true"
          ariaLabel="Nächste Woche"
        ></p-button>
      </div>

      <div class="week-info">
        <h2 class="text-xl font-bold">
          Woche {{ year() }}/{{ calendarWeek() }}
        </h2>
      </div>

      <div class="action-buttons">
        <p-button
          (click)="onSave.emit()"
          [disabled]="isSubmitted() || isSaving()"
          severity="success"
          [loading]="isSaving()"
          ariaLabel="Woche speichern"
        >
          {{ isSaving() ? 'Speichern...' : 'Speichern' }}
        </p-button>
        <p-button
          (click)="onSubmit.emit()"
          [disabled]="isSubmitted()"
          severity="info"
          ariaLabel="Woche einreichen"
        >
          {{
            isSubmitted() ? 'Woche eingereicht' : 'Woche einreichen'
          }}
        </p-button>
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

      .action-buttons {
        display: flex;
        gap: 0.5rem;
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
export class BookWeekEditHeaderComponent {
  public readonly calendarWeek = input.required<number>();
  public readonly year = input.required<number>();
  public readonly isSubmitted = input.required<boolean>();
  public readonly isSaving = input.required<boolean>();
  public readonly error = input<string | null>(null);
  public readonly previousWeekParams = input.required<Record<string, number>>();
  public readonly nextWeekParams = input.required<Record<string, number>>();

  public readonly onSave = output<void>();
  public readonly onSubmit = output<void>();
}
