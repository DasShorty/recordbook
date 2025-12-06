import {Component, inject, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Select} from 'primeng/select';
import {CreateUser, UserType} from '@core/users/models/users.model';
import {AdminUserStore} from '@core/users/state/admin.user.store';
import {Password} from 'primeng/password';

@Component({
  selector: 'user-add-button',
  imports: [
    Button,
    Dialog,
    InputText,
    ReactiveFormsModule,
    Select,
    Password
  ],
  template: `
    <p-button severity="success" (click)="toggleDialog()" [outlined]="true">
      <i class="pi pi-plus"></i>
    </p-button>
    <p-dialog (close)="clearForm()" [(visible)]="dialogVisible" [modal]="true" class="h-32">
      <ng-template #header>
        Benutzer erstellen
      </ng-template>
      <form [formGroup]="formGroup()" (submit)="submitForm()" class="flex flex-col gap-2">

        <div class="flex items-center gap-4 mb-4">
          <label for="userType" class="font-semibold w-24">Type*</label>
          <p-select [options]="Object.keys(UserType)" formControlName="userType" [showClear]="true"
                    placeholder="Wähle einen Benutzertypen"
                    class="w-full md:w-56">
            <ng-template #selectedItem let-selectedOption>
              <div class="flex items-center gap-2">
                <div>{{ selectedOption }}</div>
              </div>
            </ng-template>
            <ng-template let-selectableItem #item>
              <div class="flex items-center gap-2">
                <div>{{ selectableItem }}</div>
              </div>
            </ng-template>
          </p-select>
        </div>
        <div class="flex flex-col gap-0.5">
          @if (formGroup().controls['userType'].touched) {
            @if (formGroup().controls['userType'].hasError("required")) {
              <span>Der Benutzer benötigt einen Nachnamen</span>
            }
          }
        </div>

        <div class="flex items-center gap-4 mb-4">
          <label for="forename" class="font-semibold w-24">Vorname*</label>
          <input pInputText formControlName="forename" id="forename" class="flex-auto" autocomplete="off"/>
        </div>
        <div class="flex flex-col gap-0.5">
          @if (formGroup().controls['forename'].touched) {
            @if (formGroup().controls['forename'].hasError("required")) {
              <span>Der Benutzer benötigt einen Vornamen</span>
            }
          }
        </div>

        <div class="flex items-center gap-4 mb-4">
          <label for="surname" class="font-semibold w-24">Nachname*</label>
          <input pInputText formControlName="surname" id="surname" class="flex-auto" autocomplete="off"/>
        </div>
        <div class="flex flex-col gap-0.5">
          @if (formGroup().controls['surname'].touched) {
            @if (formGroup().controls['surname'].hasError("required")) {
              <span>Der Benutzer benötigt einen Nachnamen</span>
            }
          }
        </div>

        <div class="flex items-center gap-4 mb-4">
          <label for="email" class="font-semibold w-24">E-Mail*</label>
          <input pInputText formControlName="email" id="email" class="flex-auto" autocomplete="off"/>
        </div>
        <div class="flex flex-col gap-0.5">
          @if (formGroup().controls['email'].touched) {
            @if (formGroup().controls['email'].hasError("required")) {
              <span>Der Benutzer benötigt eine E-Mail</span>
            }
            @if (formGroup().controls['email'].hasError("email")) {
              <span>Keine valide E-Mail Adresse definiert!</span>
            }
          }
        </div>

        <div class="flex items-center gap-4 mb-4">
          <label for="password" class="font-semibold w-24">Password*</label>
          <p-password formControlName="password" [toggleMask]="true" id="password" class="flex-auto"
                      autocomplete="off"/>
        </div>
        <div class="flex flex-col gap-0.5">
          @if (formGroup().controls['password'].touched) {
            @if (formGroup().controls['password'].hasError("required")) {
              <span>Der Benutzer benötigt eine E-Mail</span>
            }
            @if (formGroup().controls['password'].hasError("maxlength")) {
              <span>Das Passwort ist zu lang!</span>
            }
            @if (formGroup().controls['password'].hasError("minlength")) {
              <span>Das Passwort ist zu kurz!</span>
            }
          }
        </div>
      </form>
      <ng-template #footer>
        <p-button label="Cancel" severity="secondary" (click)="closeForm()"/>
        <p-button [disabled]="formGroup().invalid" [loading]="this.loading()" label="Save"
                  (click)="submitForm()"/>
      </ng-template>
    </p-dialog>
  `
})
export class UserAddButton {

  readonly userStore = inject(AdminUserStore);
  readonly dialogVisible = signal<boolean>(false);
  readonly loading = signal<boolean>(false);

  readonly formGroup = signal(new FormGroup({
    forename: new FormControl<string | null>(null, {
      validators: [
        Validators.required
      ],
      updateOn: "change"
    }),
    surname: new FormControl<string | null>(null, {
      validators: [
        Validators.required
      ],
      updateOn: "change"
    }),
    userType: new FormControl<string | null>(null, {
      validators: [
        Validators.required
      ],
      updateOn: "change"
    }),
    email: new FormControl<string | null>(null, {
      validators: [
        Validators.required,
        Validators.email
      ],
      updateOn: "change"
    }),
    password: new FormControl<string | null>(null, Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(6)]))
  }));
  protected readonly Object = Object;
  protected readonly UserType = UserType;

  submitForm() {

    const formContent = this.formGroup().value as CreateUser;

    this.loading.set(true);

    this.userStore.createUser(formContent, () => {
      this.loading.set(false);
      this.closeForm();
    });

  }

  closeForm() {
    this.clearForm();
    this.toggleDialog();
  }

  toggleDialog() {
    this.dialogVisible.update(value => !value);
  }

  clearForm() {
    this.formGroup().reset();
  }
}
