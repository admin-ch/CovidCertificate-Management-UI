import {AbstractControl, ValidatorFn} from "@angular/forms";
import * as moment from 'moment';

/**
 * Validates that the start date value of the controls with the passed names is not after the end date. This
 * validator ALWAYS returns null, but it sets the error object on the date controls.
 *
 * @param startDateControlName
 * @param endDateControlName
 * @returns null
 */
export const getStartDateBeforeEndDateValidator: (startDateControlName: string, endDateControlName) => ValidatorFn = (startDateControlName: string, endDateControlName: string) => {

	const setStartDateAfterEndDateError = (startControl: AbstractControl, endControl: AbstractControl) => {
		startControl.setErrors({
			...(startControl.errors ?? {}),
			startDateAfterEndDate: true
		})
		endControl.setErrors({
			...(endControl.errors ?? {}),
			startDateAfterEndDate: true
		})
	}

	const removeStartDateAfterEndDateError = (startControl: AbstractControl, endControl: AbstractControl) => {
		if (startControl.errors?.startDateAfterEndDate !== undefined) {
			delete startControl.errors.startDateAfterEndDate
			if (Object.entries(startControl.errors).length === 0) {
				startControl.setErrors(null)
			}
		}
		if (endControl.errors?.startDateAfterEndDate !== undefined) {
			delete endControl.errors.startDateAfterEndDate
			if (Object.entries(endControl.errors).length === 0) {
				endControl.setErrors(null)
			}
		}
	}

	return (control: AbstractControl) => {
		// Safety checks
		if (!control.get(startDateControlName)?.value || !control.get(endDateControlName)?.value) {
			return null
		}

		const startDate = moment(control.get(startDateControlName).value)
		const endDate = moment(control.get(endDateControlName).value)

		if ((!moment.isMoment(startDate) || !moment.isMoment(endDate)) && (!moment.isDate(startDate) || !moment.isDate(endDate))) {
			return null
		}

		// Actual validation
		const startControl = control.get(startDateControlName)
		const endControl = control.get(endDateControlName)
		if (startDate.isAfter(endDate)) {
			setStartDateAfterEndDateError(startControl, endControl)
		} else {
			removeStartDateAfterEndDateError(startControl, endControl)
		}
	};
}
