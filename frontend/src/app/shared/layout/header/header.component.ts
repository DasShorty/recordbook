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
          <button (click)="toggleMenu()" aria-label="Toggle menu">
            <i class="pi pi-bars"></i>
          </button>
          <p>RECORDBOOK v1.0</p>
        </div>
        <div>
          <profile-component></profile-component>
        </div>
      </div>
    </header>
  `,
  styles: `
    header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 4rem;
      padding: 0 2rem;
      background-color: var(--color-white);
      z-index: 50;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);

      .inner-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 100%;
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
