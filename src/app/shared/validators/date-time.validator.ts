import {AbstractControl, ValidatorFn} from '@angular/forms';
import * as moment from 'moment';

/**
 * Validates that the start date value of the controls with the passed names is not after the end date. This
 * validator ALWAYS returns null, but it sets the error object on the date controls.
 *
 * @param startDateControlName
 * @param endDateControlName
 * @returns null
 */
export const getStartDateBeforeEndDateValidator: (startDateControlName: string, endDateControlName) => ValidatorFn =
	(startDateControlName: string, endDateControlName: string) => (control: AbstractControl) => {
		if (!validateBothDatesAvailable(control, startDateControlName, endDateControlName)) {
			return null;
		}
		// Actual validation
		const startControl = control.get(startDateControlName);
		const endControl = control.get(endDateControlName);
		const startDate = moment(control.get(startDateControlName).value);
		const endDate = moment(control.get(endDateControlName).value);
		if (startDate.isAfter(endDate)) {
			setError(startControl, endControl, 'startDateAfterEndDate', true);
		} else {
			removeError(startControl, endControl, 'startDateAfterEndDate');
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
		if (endDate.diff(startDate, 'days') >= maxPeriodInDays) {
			setError(startControl, endControl, 'maxPeriodDays', maxPeriodInDays);
		} else {
			removeError(startControl, endControl, 'maxPeriodDays');
		}
	};

const validateBothDatesAvailable = (
	control: AbstractControl,
	startDateControlName: string,
	endDateControlName: string
) => {
	if (!control.get(startDateControlName)?.value || !control.get(endDateControlName)?.value) {
		return false;
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

const setError = (startControl: AbstractControl, endControl: AbstractControl, errorName: string, errorValue: any) => {
	startControl.setErrors({
		...(startControl.errors ?? {}),
		[errorName]: errorValue
	});
	endControl.setErrors({
		...(endControl.errors ?? {}),
		[errorName]: errorValue
	});
};

const removeError = (startControl: AbstractControl, endControl: AbstractControl, errorName: string) => {
	if (startControl.errors?.[errorName] !== undefined) {
		delete startControl.errors[errorName];
		if (Object.entries(startControl.errors).length === 0) {
			startControl.setErrors(null);
		}
	}
	if (endControl.errors?.[errorName] !== undefined) {
		delete endControl.errors[errorName];
		if (Object.entries(endControl.errors).length === 0) {
			endControl.setErrors(null);
		}
	}
};
