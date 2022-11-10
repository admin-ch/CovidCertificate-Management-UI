import { AbstractControl, ValidatorFn } from "@angular/forms";
import * as moment from "moment";

/**
 * Validates that the start date value of the controls with the passed names is not after the end date. This
 * validator ALWAYS returns null, but it sets the error object on the date controls.
 *
 * @param startDateControlName
 * @param endDateControlName
 * @param startTimeControlName
 * @param endTimeControlName
 * @returns null
 */
export const getStartDateBeforeEndDateValidator: (startDateControlName: string, endDateControlName: string, startTimeControlName?: string, endTimeControlName?: string) => ValidatorFn =
	(startDateControlName: string, endDateControlName: string, startTimeControlName: string, endTimeControlName: string) => (control: AbstractControl) => {
		if (!validateBothDatesAvailable(control, startDateControlName, endDateControlName, startTimeControlName, endTimeControlName)) {
			return null;
		}
		// Actual validation
		const startDateControl = control.get(startDateControlName);
		const endDateControl = control.get(endDateControlName);
		const startTimeControl = control.get(startTimeControlName);
		const endTimeControl = control.get(endTimeControlName);
		const startDate = moment(control.get(startDateControlName).value);
		const endDate = moment(control.get(endDateControlName).value);

		if (startDate.isAfter(endDate)) {
			setError(startDateControl, endDateControl, startTimeControl, endTimeControl, "startDateAfterEndDate", true);
		} else {
			removeError(startDateControl, endDateControl, startTimeControl, endTimeControl, "startDateAfterEndDate");
		}
	};

/**
 * Validates that the days between the start date and the end date is not greater than the passed value. This
 * validator ALWAYS returns null, but it sets the error object on the date controls.
 *
 * @param startDateControlName
 * @param endDateControlName
 * @param maxPeriodInDays
 * @returns null
 */
export const getMaxPeriodValidator: (
	startDateControlName: string,
	endDateControlName: string,
	maxPeriodInDays: number
) => ValidatorFn =
	(startDateControlName: string, endDateControlName: string, maxPeriodInDays: number) =>
		(control: AbstractControl) => {
			// Safety checks
			if (!validateBothDatesAvailable(control, startDateControlName, endDateControlName)) {
				return null;
			}

			const startDate = moment(control.get(startDateControlName).value);
			const endDate = moment(control.get(endDateControlName).value);

			if (startDate.isAfter(endDate)) {
				return null;
			}

			// Actual validation
			const startControl = control.get(startDateControlName);
			const endControl = control.get(endDateControlName);
			if (endDate.diff(startDate, "days") >= maxPeriodInDays) {
				setError(startControl, endControl, null, null, "maxPeriodDays", maxPeriodInDays);
			} else {
				removeError(startControl, endControl, null, null, "maxPeriodDays");
			}
		};

const validateBothDatesAvailable = (
	control: AbstractControl,
	startDateControlName: string,
	endDateControlName: string,
	startTimeControlName?: string,
	endTimeControlName?: string
) => {
	if (!control.get(startDateControlName)?.value || !control.get(endDateControlName)?.value) {
		return false;
	}

	if (startTimeControlName || endTimeControlName) {
		if (startTimeControlName && endTimeControlName) {
			if (!control.get(startTimeControlName)?.value || !control.get(endTimeControlName)?.value) {
				return false;
			}
		} else {
			return false
		}
	}


	const startDate = moment(control.get(startDateControlName).value);
	const endDate = moment(control.get(endDateControlName).value);

	if (
		(!moment.isMoment(startDate) || !moment.isMoment(endDate)) &&
		(!moment.isDate(startDate) || !moment.isDate(endDate))
	) {
		return false;
	}
	return true;
};

const setError = (startDateControl: AbstractControl, endDateControl: AbstractControl, startTimeControl: AbstractControl | null, endTimeControl: AbstractControl | null, errorName: string, errorValue: any) => {
	startDateControl.setErrors({
		...(startDateControl.errors ?? {}),
		[errorName]: errorValue
	});
	startTimeControl?.setErrors({
		...(startDateControl.errors ?? {}),
		[errorName]: errorValue
	});
	endDateControl.setErrors({
		...(endDateControl.errors ?? {}),
		[errorName]: errorValue
	});
	endTimeControl?.setErrors({
		...(endDateControl.errors ?? {}),
		[errorName]: errorValue
	});
};

const removeError = (startDateControl: AbstractControl, endDateControl: AbstractControl | null, startTimeControl: AbstractControl | null, endTimeControl: AbstractControl, errorName: string) => {
	if (startDateControl.errors?.[errorName] !== undefined) {
		delete startDateControl.errors[errorName];
		if (Object.entries(startDateControl.errors).length === 0) {
			startDateControl.setErrors(null);
		}
	}
	if (startTimeControl?.errors?.[errorName] !== undefined) {
		delete startTimeControl.errors[errorName];
		if (Object.entries(startTimeControl.errors).length === 0) {
			startTimeControl.setErrors(null);
		}
	}
	if (endDateControl.errors?.[errorName] !== undefined) {
		delete endDateControl.errors[errorName];
		if (Object.entries(endDateControl.errors).length === 0) {
			endDateControl.setErrors(null);
		}
	}
	if (endTimeControl?.errors?.[errorName] !== undefined) {
		delete endTimeControl.errors[errorName];
		if (Object.entries(endTimeControl.errors).length === 0) {
			endTimeControl.setErrors(null);
		}
	}
};
