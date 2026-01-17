import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BookDay} from '@features/book/models/book.day.model';
import {BookDayFormValue, BookWeekUpdatePayload} from '@features/book/models/book.day.form.value';

@Injectable({providedIn: 'root'})
export class BookWeekFormService {


  createFormGroupForDay(bookDay: BookDay, disabled: boolean): FormGroup {
    return new FormGroup({
      id: new FormControl<string>(
        {value: bookDay.id, disabled},
        {nonNullable: true}
      ),
      date: new FormControl<string>(
        {value: bookDay.date, disabled},
        {nonNullable: true}
      ),
      presence: new FormControl<string | undefined>(
        {value: bookDay.presence, disabled},
        {nonNullable: false}
      ),
      presenceLocation: new FormControl<string | undefined>(
        {value: bookDay.presenceLocation, disabled},
        {nonNullable: false}
      ),
      hours: new FormControl<number>(
        {value: bookDay.hours, disabled},
        {
          nonNullable: true,
          validators: [Validators.required, Validators.min(0), Validators.max(24)],
        }
      ),
      minutes: new FormControl<number>(
        {value: bookDay.minutes, disabled},
        {
          nonNullable: true,
          validators: [Validators.required, Validators.min(0), Validators.max(59)],
        }
      ),
    });
  }

  createFormGroupsForWeek(days: BookDay[], disabled: boolean): FormGroup[] {
    return days.map((day) => this.createFormGroupForDay(day, disabled));
  }

  formGroupToBookDayFormValue(formGroup: FormGroup): BookDayFormValue {
    if (formGroup.invalid) {
      throw new Error('FormGroup ist ungültig und kann nicht konvertiert werden');
    }

    const value = formGroup.getRawValue();

    return {
      id: value.id,
      date: value.date,
      presence: value.presence,
      presenceLocation: value.presenceLocation,
      hours: value.hours,
      minutes: value.minutes,
    };
  }

  formGroupsToBookDayFormValues(formGroups: FormGroup[]): BookDayFormValue[] {
    return formGroups.map((fg) => this.formGroupToBookDayFormValue(fg));
  }

  validateFormGroups(
    formGroups: FormGroup[],
    weekText: string
  ): { isValid: boolean; error?: string } {
    if (formGroups.length === 0) {
      return {isValid: false, error: 'Keine Tage in der Woche vorhanden'};
    }

    const hasValidForm = formGroups.some((fg) => fg.valid);
    if (!hasValidForm) {
      return {isValid: false, error: 'Bitte füllen Sie mindestens einen Tag aus'};
    }

    if (weekText && weekText.length < 10) {
      return {
        isValid: false,
        error: 'Wochenbeschreibung muss mindestens 10 Zeichen lang sein',
      };
    }

    return {isValid: true};
  }

  createUpdatePayload(
    weekId: string,
    bookId: string,
    weekText: string,
    formGroups: FormGroup[]
  ): BookWeekUpdatePayload {
    const validation = this.validateFormGroups(formGroups, weekText);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Formularvalidierung fehlgeschlagen');
    }

    return {
      weekId,
      bookId,
      text: weekText,
      days: this.formGroupsToBookDayFormValues(formGroups),
    };
  }

  bookDayFormValueToBookDay(formValue: BookDayFormValue): BookDay {
    return {
      id: formValue.id,
      date: formValue.date,
      presence: formValue.presence ?? undefined, // Fallback auf Default
      presenceLocation: formValue.presenceLocation ?? undefined, // Fallback auf Default
      hours: formValue.hours,
      minutes: formValue.minutes,
    };
  }

  bookDayFormValuesToBookDays(formValues: BookDayFormValue[]): BookDay[] {
    return formValues.map((fv) => this.bookDayFormValueToBookDay(fv));
  }
}
