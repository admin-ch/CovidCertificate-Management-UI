import {FormControl, FormGroup} from '@angular/forms';
import {DosesValidators} from './doses-validator';

describe('DosesValidators', () => {
	describe('validateDoses', () => {
		it('should validate doseNumber > totalDoses correctly', () => {
			const testGroup: FormGroup = new FormGroup({
				doseNumber: new FormControl(2),
				totalDoses: new FormControl(1)
			});
			expect(DosesValidators.validateDoses(testGroup)).toEqual({dosesTooBig: true});
		});

		it('should validate doseNumber = totalDoses correctly', () => {
			const testGroup: FormGroup = new FormGroup({
				doseNumber: new FormControl(2),
				totalDoses: new FormControl(2)
			});

			expect(DosesValidators.validateDoses(testGroup)).toBeNull();
		});

		it('should validate doseNumber < totalDoses correctly', () => {
			const testGroup: FormGroup = new FormGroup({
				doseNumber: new FormControl(1),
				totalDoses: new FormControl(2)
			});
			expect(DosesValidators.validateDoses(testGroup)).toBeNull();
		});
	});
});
