import {FormControl, FormGroup} from '@angular/forms';
import {getMaxPeriodValidator, getStartDateBeforeEndDateValidator} from 'shared/validators/date-time.validator';
import * as moment from 'moment';

describe('getStartDateBeforeEndDateValidator', () => {
	let formGroup: FormGroup;
	let startDateControl: FormControl;
	let endDateControl: FormControl;

	beforeEach(() => {
		startDateControl = new FormControl('');
		endDateControl = new FormControl('');
		formGroup = new FormGroup({
			start: startDateControl,
			end: endDateControl
		});
	});

	it.each([
		[moment('2022-06-15'), moment('2022-06-15'), true],
		[moment('2022-06-10'), moment('2022-06-15'), true],
		[moment('2021-06-20'), moment('2022-06-15'), true],
		[moment('2022-06-16'), moment('2022-06-15'), false],
		[moment(''), moment('2022-06-15'), true],
		[moment('2022-06-15'), moment(''), true],
		[null, null, true],
		[moment('2022-06-15T15:00'), moment('2022-06-15T15:00'), true],
		[moment('2022-06-15T15:00'), moment('2022-06-15T16:00'), true],
		[moment('2022-06-15T15:00'), moment('2022-06-15T14:00'), false],
		[moment('2022-06-15T15:00'), moment('2022-06-15T14:59'), false]
	])('when startDate is %s, endDate is %s, startTime is %s, endTime is %s, control.valid should be %s', (startDate, endDate, valid) => {
		startDateControl.setValue(startDate);
		endDateControl.setValue(endDate);
		startDateControl.updateValueAndValidity();
		endDateControl.updateValueAndValidity();

		getStartDateBeforeEndDateValidator('start', 'end')(formGroup);

		expect(startDateControl.valid).toBe(valid);
		expect(endDateControl.valid).toBe(valid);
	});

	it("should set formControl's error to null if no other errors are present", () => {
		startDateControl.setValue(moment('2022-06-15'));
		endDateControl.setValue(moment('2022-06-15'));
		startDateControl.setErrors({startDateAfterEndDate: true});
		endDateControl.setErrors({startDateAfterEndDate: true});

		getStartDateBeforeEndDateValidator('start', 'end')(formGroup);

		expect(startDateControl.errors).toBe(null);
		expect(endDateControl.errors).toBe(null);
	});

	it("should remove only the startDateAfterEndDate error if formControl's have other errors", () => {
		startDateControl.setValue(moment('2022-06-15'));
		endDateControl.setValue(moment('2022-06-15'));
		startDateControl.setErrors({startDateAfterEndDate: true, otherError: true});
		endDateControl.setErrors({startDateAfterEndDate: true, otherError: true});

		getStartDateBeforeEndDateValidator('start', 'end')(formGroup);

		expect(startDateControl.errors).toEqual({otherError: true});
		expect(endDateControl.errors).toEqual({otherError: true});
	});
});

describe('getMaxPeriodValidator', () => {
	let formGroup: FormGroup;
	let startControl: FormControl;
	let endControl: FormControl;

	beforeEach(() => {
		startControl = new FormControl('');
		endControl = new FormControl('');
		formGroup = new FormGroup({
			start: startControl,
			end: endControl
		});
	});

	it.each([
		[moment('2022-06-15'), moment('2022-06-15'), true],
		[moment('2022-06-10'), moment('2022-06-15'), true],
		[moment('2022-06-16'), moment('2022-06-15'), true],
		[moment(''), moment('2022-06-15'), true],
		[moment('2022-06-15'), moment(''), true],
		[null, null, true],
		[moment('2022-06-01'), moment('2022-06-30'), true],
		[moment('2022-06-01'), moment('2022-07-01'), false],
		[moment('2022-06-01'), moment('2022-08-01'), false]
	])('when start is %s, and end is %s, control.valid should be %s', (start, end, valid) => {
		startControl.setValue(start);
		endControl.setValue(end);
		startControl.updateValueAndValidity();
		endControl.updateValueAndValidity();

		getMaxPeriodValidator('start', 'end', 30)(formGroup);

		expect(startControl.valid).toBe(valid);
		expect(endControl.valid).toBe(valid);
	});

	it("should set formControl's error to null if no other errors are present", () => {
		startControl.setValue(moment('2022-06-15'));
		endControl.setValue(moment('2022-06-15'));
		startControl.setErrors({maxPeriodDays: true});
		endControl.setErrors({maxPeriodDays: true});

		getMaxPeriodValidator('start', 'end', 30)(formGroup);

		expect(startControl.errors).toBe(null);
		expect(endControl.errors).toBe(null);
	});

	it("should remove only the maxPeriodDays error if formControl's have other errors", () => {
		startControl.setValue(moment('2022-06-15'));
		endControl.setValue(moment('2022-06-15'));
		startControl.setErrors({maxPeriodDays: true, otherError: true});
		endControl.setErrors({maxPeriodDays: true, otherError: true});

		getMaxPeriodValidator('start', 'end', 30)(formGroup);

		expect(startControl.errors).toEqual({otherError: true});
		expect(endControl.errors).toEqual({otherError: true});
	});
});
