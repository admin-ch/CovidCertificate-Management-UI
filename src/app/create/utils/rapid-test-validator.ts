import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ProductInfoWithToString} from 'shared/model';

export class RapidTestValidator {
	static testRequired: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;
		if (!(value instanceof ProductInfoWithToString)) {
			return {required: true};
		}

		return null;
	};
}
