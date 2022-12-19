import {TimeValidators} from './time-validators';
import {FormControl} from '@angular/forms';

describe('TimeValidator', () => {
	const control = new FormControl('input');

	describe('validate time', () => {
		it('should validate every valid time correctly', () => {
			const test = TimeValidators.validateTime();
			for (let hour = 0; hour < 24; hour++) {
				for (let minute = 0; minute < 60; minute++) {
					control.setValue({time: `${addZeroIfLessThanTen(hour)}:${addZeroIfLessThanTen(minute)}`});
					expect(test(control)).toBeNull();
				}
			}
		});

		it('should show error on invalid time', () => {
			const test = TimeValidators.validateTime();

			control.setValue({time: '24:00'});
			expect(test(control)).toStrictEqual({timeInvalid: true});

			control.setValue({time: '00:60'});
			expect(test(control)).toStrictEqual({timeInvalid: true});

			control.setValue({time: 'aa:50'});
			expect(test(control)).toStrictEqual({timeInvalid: true});
		});
	});
});

const addZeroIfLessThanTen = (n: number): string => `0${n}`.slice(-2);
