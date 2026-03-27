import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateUser, UserType} from '@core/users/models/users.model';
import {AdminUserStore} from '@core/users/state/admin.user.store';
import {HlmButton} from '@spartan-ng/helm/button';

@Component({
  selector: 'user-add-button',
  imports: [
    ReactiveFormsModule,
    HlmButton
  ],
  template: `
    <button hlmBtn variant="outline" (click)="toggleDialog()" type="button">
      +
    </button>

    @if (dialogVisible()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" (click)="closeForm()">
        <div class="w-full max-w-2xl rounded-md bg-white p-4" (click)="$event.stopPropagation()">
          <h2 class="mb-4 text-lg font-semibold">Benutzer erstellen</h2>
          <form [formGroup]="formGroup()" (submit)="submitForm()" class="flex flex-col gap-2">

            <div class="flex items-center gap-4 mb-4">
              <label for="userType" class="font-semibold w-24">Type*</label>
              <select id="userType" class="w-full md:w-56 border rounded-md h-9 px-2" formControlName="userType">
                <option [ngValue]="null">Wähle einen Benutzertypen</option>
                @for (userType of userTypes; track userType) {
                  <option [ngValue]="userType">{{ userType }}</option>
                }
              </select>
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
              <input formControlName="forename" id="forename" class="flex-auto border rounded-md h-9 px-3"
                     autocomplete="off"/>
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
              <input formControlName="surname" id="surname" class="flex-auto border rounded-md h-9 px-3"
                     autocomplete="off"/>
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
              <input formControlName="email" id="email" class="flex-auto border rounded-md h-9 px-3"
                     autocomplete="off"/>
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
              <input formControlName="password" id="password" class="flex-auto border rounded-md h-9 px-3"
                     autocomplete="off" type="password"/>
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
            <div class="mt-4 flex justify-end gap-2">
              <button hlmBtn variant="outline" type="button" (click)="closeForm()">Cancel</button>
              <button hlmBtn [disabled]="formGroup().invalid || this.loading()" type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class UserAddButton {

  readonly userStore = inject(AdminUserStore);
  readonly dialogVisible = signal<boolean>(false);
  readonly loading = signal<boolean>(false);
  readonly userTypes = Object.keys(UserType);

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

  submitForm() {

    const formContent = this.formGroup().value as CreateUser;

    this.loading.set(true);

    this.userStore.createUser(formContent, () => {
      this.loading.set(false);
      this.closeForm();

      this.userStore.getUsers();
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
