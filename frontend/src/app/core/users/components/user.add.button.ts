import {Component, inject, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Select} from 'primeng/select';
import {UserType} from '@core/users/models/users.model';
import {AdminUserStore} from '@core/users/state/admin.user.store';
import {CompanyOptionStore} from '@features/company/state/company.option.store';
import {CompanyOption} from '@features/company/models/company.model';

@Component({
  selector: 'user-add-button',
  imports: [
    Button,
    Dialog,
    InputText,
    ReactiveFormsModule,
    Select
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
          @if (httpError()) {
            <span>Ein Fehler ist bei der Übertragung der Daten aufgetreten. Bitte versuche es erneut!</span>
          }
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
          @if (httpError()) {
            <span>Ein Fehler ist bei der Übertragung der Daten aufgetreten. Bitte versuche es erneut!</span>
          }
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
          @if (httpError()) {
            <span>Ein Fehler ist bei der Übertragung der Daten aufgetreten. Bitte versuche es erneut!</span>
          }
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
          @if (httpError()) {
            <span>Ein Fehler ist bei der Übertragung der Daten aufgetreten. Bitte versuche es erneut!</span>
          }
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
          <label for="companyId" class="font-semibold w-24">Unternehmen</label>
          <p-select
            fluid
            [options]="this.companyOptionStore.companies()"
            formControlName="companyId"
            (onShow)="this.companyOptionStore.retrieveCompanies()"
            (onLazyLoad)="this.companyOptionStore.retrieveCompaniesLazy()"
            appendTo="body">
            <ng-template #selectedItem #item let-data>
              <span>{{ data.companyName }}</span>
            </ng-template>
          </p-select>
        </div>
        <div class="flex flex-col gap-0.5">
          @if (httpError()) {
            <span>Ein Fehler ist bei der Übertragung der Daten aufgetreten. Bitte versuche es erneut!</span>
          }
          @if (formGroup().controls['companyId'].touched) {
            @if (formGroup().controls['companyId'].hasError("required")) {
              <span>Der Benutzer benötigt eine E-Mail</span>
            }
          }
        </div>
      </form>
      <ng-template #footer>
        <p-button label="Cancel" severity="secondary" (click)="closeForm()"/>
        <p-button [disabled]="formGroup().invalid" [loading]="this.userStore.loading()" label="Save"
                  (click)="submitForm()"/>
      </ng-template>
    </p-dialog>
  `
})
export class UserAddButton {

  readonly userStore = inject(AdminUserStore);
  readonly httpError = signal(false);
  readonly dialogVisible = signal<boolean>(false);
  readonly companyOptionStore = inject(CompanyOptionStore);

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
    companyId: new FormControl<CompanyOption | null>(null, {
      updateOn: "change"
    })
  }));
  protected readonly Object = Object;
  protected readonly UserType = UserType;

  submitForm() {

    const formContent = this.formGroup().value;

    if (formContent.forename === null || formContent.forename === undefined) {
      return;
    }

    if (formContent.surname === null || formContent.surname === undefined) {
      return;
    }

    if (formContent.userType === null || formContent.userType === undefined) {
      return;
    }

    if (formContent.email === null || formContent.email === undefined) {
      return;
    }

    this.userStore.createUser(formContent.forename, formContent.surname, formContent.email, formContent.userType, formContent.companyId?.id).then(() => {

      if (this.userStore.error()) {
        this.httpError.set(true);
      } else {
        this.closeForm();
      }

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
