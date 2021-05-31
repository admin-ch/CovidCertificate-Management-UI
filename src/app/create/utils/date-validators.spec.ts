import {DateValidators} from './date-validators';
import {FormControl} from '@angular/forms';

describe('DateValidators', () => {
	const control = new FormControl('input');
	const dateFuture: Date = new Date('9999-04-29');
	const datePast: Date = new Date('2000-04-29');
	const dateToOld: Date = new Date('1899-12-31');
	const timeNoon = '12:00';

	describe('dateLessThanToday', () => {
		it('should validate a date in the past correctly', () => {
			control.setValue({date: datePast});
			const test = DateValidators.dateLessThanToday();
			expect(test(control)).toBeNull();
		});

		it('should validate a date today correctly', () => {
			control.setValue({date: new Date().toString()});
			const test = DateValidators.dateLessThanToday();
			expect(test(control)).toBeNull();
		});

		it('should validate a date in the future correctly', () => {
			control.setValue({date: dateFuture});
			const test = DateValidators.dateLessThanToday();
			expect(test(control)).toEqual({dateAfterToday: true});
		});
	});

	describe('dateMoreThanMinDate', () => {
		it('should validate a date to old correctly', () => {
			control.setValue({date: dateToOld});
			const test = DateValidators.dateMoreThanMinDate();
			expect(test(control)).toEqual({dateTooSmall: true});
		});

		it('should validate a date in the past correctly', () => {
			control.setValue({date: datePast});
			const test = DateValidators.dateMoreThanMinDate();
			expect(test(control)).toBeNull();
		});

		it('should validate a date today correctly', () => {
			control.setValue({date: new Date().toString()});
			const test = DateValidators.dateMoreThanMinDate();
			expect(test(control)).toBeNull();
		});

		it('should validate a date in the future correctly', () => {
			control.setValue({date: dateFuture});
			const test = DateValidators.dateMoreThanMinDate();
			expect(test(control)).toBeNull();
		});
	});

	describe('dateTimeLessThanToday', () => {
		it('should validate a date in the past correctly', () => {
			control.setValue({date: datePast, time: timeNoon});
			const test = DateValidators.dateTimeLessThanToday();
			expect(test(control)).toBeNull();
		});
		it('should validate a today correctly', () => {
			const testDate: Date = new Date();
			const time = `${testDate.getHours()}:${testDate.getMinutes()}`;
			control.setValue({date: testDate.toDateString(), time});
			const test = DateValidators.dateTimeLessThanToday();
			expect(test(control)).toBeNull();
		});
		it('should validate a date in the future correctly', () => {
			control.setValue({date: dateFuture, time: timeNoon});
			const test = DateValidators.dateTimeLessThanToday();
			expect(test(control)).toEqual({dateAfterToday: true});
		});
		it('should validate a date one hour in the future correctly', () => {
			const testDate: Date = new Date();
			testDate.setTime(testDate.getTime() + 60 * 60 * 1000);
			const time = `${testDate.getHours()}:${testDate.getMinutes()}`;
			control.setValue({date: testDate.toDateString(), time});
			const test = DateValidators.dateTimeLessThanToday();
			expect(test(control)).toEqual({timeAfterToday: true});
		});
	});
});
