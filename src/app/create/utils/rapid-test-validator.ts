import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {RapidTestProductInfoWithToString} from 'shared/model';

export class RapidTestValidator {
	static testRequired: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;
		if (!(value instanceof RapidTestProductInfoWithToString)) {
			return {required: true};
		}

		return null;
	};
}
