import {Component, inject} from '@angular/core';
import {LayoutStore} from '@shared/layout/layout.store';
import {ProfileComponent} from '@shared/layout/header/profile.component';

@Component({
  selector: 'header-component',
  imports: [
    ProfileComponent,
  ],
  template: `
    <header>
      <div class="inner-header">
        <div class="logo-menu">
          <button (click)="toggleMenu()">
            <i class="pi pi-bars"></i> <!--TODO - add menu toggle-->
          </button>
          <p>LOGO</p>
        </div>
        <div>
          <profile-component></profile-component>
        </div>
      </div>
    </header>
  `,
  styles: `
    header {
      padding: 0.5rem 5rem 0.5rem 5rem;
      background-color: var(--color-white);

      .inner-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .logo-menu {
        display: flex;
        gap: 0.5rem;
        align-items: center;

        button {

          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 2rem;
          height: 2rem;

          color: var(--color-gray-500);
          cursor: pointer;
          border-radius: 1000px;
          transition: 0.3s ease-in-out;

          &:hover {

            background-color: var(--color-gray-200);

          }

        }

      }

    }
  `
})
export class HeaderComponent {

  private readonly layoutStore = inject(LayoutStore);

  toggleMenu() {
    this.layoutStore.toggleMenu();
  }
}
