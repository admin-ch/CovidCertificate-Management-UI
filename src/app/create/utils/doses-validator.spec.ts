import {FormControl, FormGroup} from '@angular/forms';
import {DosesValidators} from './doses-validator';

describe('DosesValidators', () => {
	describe('validateDoses', () => {
		it('Given doseNumber > totalDoses and totalDoses different from 1, when validated, it should return dosesNotValid error.', () => {
			const testGroup: FormGroup = new FormGroup({
				doseNumber: new FormControl(3),
				totalDoses: new FormControl(2)
			});
			expect(DosesValidators.validateDoses(testGroup)).toEqual({dosesNotValid: true});
		});

		it('Given doseNumber > totalDoses and totalDoses equal 1, when validated, it should not return errors.', () => {
			const testGroup: FormGroup = new FormGroup({
				doseNumber: new FormControl(3),
				totalDoses: new FormControl(1)
			});
			expect(DosesValidators.validateDoses(testGroup)).toBeNull();
		});

		it('Given doseNumber equal totalDoses,when validated, it should not return errors.', () => {
			const testGroup: FormGroup = new FormGroup({
				doseNumber: new FormControl(2),
				totalDoses: new FormControl(2)
			});

			expect(DosesValidators.validateDoses(testGroup)).toBeNull();
		});

		it('Given doseNumber < totalDoses, when validated, it should not return errors.', () => {
			const testGroup: FormGroup = new FormGroup({
				doseNumber: new FormControl(1),
				totalDoses: new FormControl(2)
			});
			expect(DosesValidators.validateDoses(testGroup)).toBeNull();
		});
	});
});
