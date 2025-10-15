import {Component, computed, inject} from '@angular/core';
import {UserStore} from '@shared/users/user.store';
import {Button} from 'primeng/button';

@Component({
  selector: 'company-required-component',
  imports: [
    Button
  ],
  template: `

    @if (activeUser().assignedCompany.isEmpty()) {
      <div class="flex-1 justify-center">

        <i class="pi pi-exclamation-triangle" style="color: red"></i>
        <h2>You are not assigned to an Organisation!</h2>
        <p-button (click)="assignUserToOrganisation()"></p-button>

      </div>
    }

  `
})
export class CompanyRequiredComponent {

  private readonly userStore = inject(UserStore);
  protected readonly activeUser = computed(() => this.userStore.getActiveUser());

  assignUserToOrganisation() {

  }
}
