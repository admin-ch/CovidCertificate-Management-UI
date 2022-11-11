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

	describe('invalidShortDate', () => {
		it('should validate jjjj correctly', () => {
			control.setValue({date: '2000'});
			const test = DateValidators.validShortDate();
			expect(test(control)).toBeNull();
		});

		it('should validate jjjj low limits correctly', () => {
			const test = DateValidators.validShortDate();

			// allowed
			control.setValue({date: '1900'});
			expect(test(control)).toBeNull();

			// not allowed
			control.setValue({date: '1899'});
			expect(test(control)).toMatchObject({invalidShortDate: true});
		});

		it('should validate jjjj high limits correctly', () => {
			const test = DateValidators.validShortDate();

			// allowed
			control.setValue({date: '2099'});
			expect(test(control)).toBeNull();

			// not allowed
			control.setValue({date: '2100'});
			expect(test(control)).toMatchObject({invalidShortDate: true});
		});

		it('should validate jjjj-mm correctly', () => {
			const test = DateValidators.validShortDate();
			for (let month = 1; month < 13; month++) {
				control.setValue({date: `2000-${addZeroIfLessThanTen(month)}`});
				expect(test(control)).toBeNull();
			}
		});

		it('should fail on invalid jjjj-mm', () => {
			control.setValue({date: '2000-100'});
			const test = DateValidators.validShortDate();
			expect(test(control)).toMatchObject({invalidShortDate: true});
		});

		it('should fail on invalid format', () => {
			const test = DateValidators.validShortDate();

			control.setValue({date: '2000.12'});
			expect(test(control)).toMatchObject({invalidShortDate: true});

			control.setValue({date: '2000/12'});
			expect(test(control)).toMatchObject({invalidShortDate: true});
		});

		it('should fail on invalid string', () => {
			control.setValue({date: 'test'});
			const test = DateValidators.validShortDate();
			expect(test(control)).toMatchObject({invalidShortDate: true});
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

const addZeroIfLessThanTen = (n: number): string => `0${n}`.slice(-2);
