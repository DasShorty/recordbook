import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {UserStore} from '@core/users/state/user.store';
import {Authority} from '@core/users/models/users.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  template: `
    <div class="page-container">
      <div class="welcome-card">
        <h1>Welcome to Recordbook</h1>
        <p>Manage your training records efficiently</p>
      </div>

      <div class="quick-links">
        <h2>Quick Navigation</h2>

        @if (isAdmin()) {
          <mat-card class="link-card">
            <mat-card-header>
              <mat-icon>people</mat-icon>
              <span>User Administration</span>
            </mat-card-header>
            <mat-card-content>
              Manage users, create new accounts, and assign roles
            </mat-card-content>
            <mat-card-actions>
              <button mat-button routerLink="/users" color="primary">
                Go to Users
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="link-card">
            <mat-card-header>
              <mat-icon>book</mat-icon>
              <span>Recordbook Management</span>
            </mat-card-header>
            <mat-card-content>
              Manage recordbooks and assign trainers to trainees
            </mat-card-content>
            <mat-card-actions>
              <button mat-button routerLink="/recordbooks" color="primary">
                Go to Recordbooks
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        }

        @if (isTrainee()) {
          <mat-card class="link-card">
            <mat-card-header>
              <mat-icon>edit_note</mat-icon>
              <span>Week Fillout</span>
            </mat-card-header>
            <mat-card-content>
              Fill out and submit your weekly records for trainer review
            </mat-card-content>
            <mat-card-actions>
              <button mat-button routerLink="/weeks/fillout" color="primary">
                Fill Week
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        }

        @if (isTrainer()) {
          <mat-card class="link-card">
            <mat-card-header>
              <mat-icon>assignment_turned_in</mat-icon>
              <span>Week Approval</span>
            </mat-card-header>
            <mat-card-content>
              Review and approve or deny weeks submitted by your trainees
            </mat-card-content>
            <mat-card-actions>
              <button mat-button routerLink="/weeks/approval" color="primary">
                Review Weeks
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        }

        @if (isTrainee() || isTrainer()) {
          <mat-card class="link-card">
            <mat-card-header>
              <mat-icon>calendar_month</mat-icon>
              <span>Week Overview</span>
            </mat-card-header>
            <mat-card-content>
              View all weeks and manage your records
            </mat-card-content>
            <mat-card-actions>
              <button mat-button routerLink="/weeks/overview" color="primary">
                View Weeks
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-card {
      text-align: center;
      padding: 48px 24px;
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      border-radius: 8px;
      margin-bottom: 48px;
    }

    .welcome-card h1 {
      margin: 0 0 8px 0;
      font-size: 2.5em;
    }

    .welcome-card p {
      margin: 0;
      font-size: 1.1em;
      opacity: 0.95;
    }

    .quick-links {
      margin-bottom: 24px;
    }

    .quick-links h2 {
      margin-bottom: 24px;
    }

    .link-card {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
    }

    mat-card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
      font-weight: 500;
      font-size: 1.1em;
    }

    mat-card-header mat-icon {
      color: #1976d2;
      font-size: 2em;
      width: 40px;
      height: 40px;
    }

    mat-card-actions {
      margin-top: auto;
      justify-content: flex-start;
      gap: 8px;
    }

    button mat-icon {
      margin-left: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomePage {
  private readonly userStore = inject(UserStore);

  isAdmin(): boolean {
    return this.userStore.getActiveUser().authority === Authority.ADMINISTRATOR;
  }

  isTrainee(): boolean {
    return this.userStore.getActiveUser().authority === Authority.TRAINEE;
  }

  isTrainer(): boolean {
    return this.userStore.getActiveUser().authority === Authority.TRAINER;
  }
}


