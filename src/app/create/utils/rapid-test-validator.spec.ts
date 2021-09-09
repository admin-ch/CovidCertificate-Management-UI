import {FormControl, FormGroup} from '@angular/forms';
import {ProductInfoWithToString} from 'shared/model';
import {RapidTestValidator} from './rapid-test-validator';

describe('RapidTestValidator', () => {
	describe('testRequired', () => {
		const mockRapidTest = new ProductInfoWithToString('testCode', 'testDisplay');

		it('should mark no value as invalid', () => {
			const formControl = new FormControl();
			expect(RapidTestValidator.testRequired(formControl)).toEqual({required: true});

			formControl.setValue('');
			expect(RapidTestValidator.testRequired(formControl)).toEqual({required: true});
		});

		it('should mark RapidTest as valid', () => {
			const formControl = new FormControl('');
			formControl.setValue(mockRapidTest);
			expect(RapidTestValidator.testRequired(formControl)).toBeNull();
		});
	});
});
