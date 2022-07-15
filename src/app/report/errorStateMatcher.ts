import {InjectionToken} from "@angular/core";
import {ErrorStateMatcher} from "@angular/material/core";
import {FormControl} from "@angular/forms";

export const REPORT_ERROR_STATE_MATCHER = new InjectionToken<ErrorStateMatcher>('ReportErrorStateMatcher')

/** Use custom error state matcher for inputs in mat-form-field, otherwise switching between report types results
 * in inputs being shown as invalid initially. */
export class ReportErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null): boolean {
		return !!(control && control.invalid && control.touched);
	}
}

