import {Component, inject, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CompanyFormValidator} from '@shared/company/company.form.validator';
import {CompanyStore} from '@shared/company/company.store';

@Component({
  selector: 'company-add-button',
  imports: [
    Button,
    Dialog,
    InputText,
    ReactiveFormsModule
  ],
  template: `
    <p-button severity="success" (click)="toggleDialog()" [outlined]="true">
      <i class="pi pi-plus"></i>
    </p-button>
    <p-dialog [(visible)]="dialogVisible" [modal]="true">
      <ng-template #header>
        Unternehmen erstellen
      </ng-template>
      <form [formGroup]="formGroup()" (submit)="submitForm()">
        <div class="flex items-center gap-4 mb-4">
          <label for="company" class="font-semibold w-24">Name</label>
          <input pInputText formControlName="company" id="company" class="flex-auto" autocomplete="off"/>
        </div>
        <div class="flex flex-col gap-0.5">
          @if (httpError()) {
            <span>Ein Fehler ist bei der Übertragung der Daten aufgetreten. Bitte versuche es erneut!</span>
          }
          @if (formGroup().controls['company'].errors && formGroup().dirty) {
            @if (formGroup().controls['company'].hasError("required")) {
              <span>Ein Name für das Unternehmen muss angegeben werden.</span>
            }
            @if (formGroup().controls['company'].hasError("uniqueCompanyName")) {
              <span>Der Name für das Unternehmen kann nicht verwendet werden.</span>
            }
          }
        </div>
      </form>
      <ng-template #footer>
        <p-button label="Cancel" severity="secondary" (click)="closeForm()"/>
        <p-button [disabled]="formGroup().invalid" [loading]="loading()" label="Save" (click)="submitForm()"/>
      </ng-template>
    </p-dialog>
  `
})
export class CompanyAddButton {

  private readonly companyStore = inject(CompanyStore);
  private readonly companyNameValidator = inject(CompanyFormValidator);
  readonly httpError = signal(false);
  readonly loading = signal(false);
  readonly dialogVisible = signal<boolean>(false);
  readonly formGroup = signal(new FormGroup({
    company: new FormControl<string | null>(null, {
      validators: [
        Validators.required
      ],
      asyncValidators: [
        this.companyNameValidator.validate.bind(this.companyNameValidator)
      ],
      updateOn: "change"
    }),
  }));

  submitForm() {

    this.loading.set(true);

    const formContent = this.formGroup().value;

    if (formContent.company === null || formContent.company === undefined) {
      return;
    }

    this.companyStore.createCompany(formContent.company).then(responseContent => {

      this.loading.set(false);

      switch (responseContent) {
        case 201:

          this.httpError.set(false);
          this.toggleDialog();

          break;

        default:
          this.httpError.set(true);
          break;
      }

    });

  }

  closeForm() {
    this.formGroup().reset();
    this.toggleDialog();
  }

  toggleDialog() {
    this.dialogVisible.update(value => !value);
  }
}
