import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export class DosesValidators {
	static validateDoses: ValidatorFn = (form: FormGroup): ValidationErrors | null => {
		const doseNumber: AbstractControl = form.get('doseNumber');
		const totalDoses: AbstractControl = form.get('totalDoses');

		if (doseNumber && totalDoses && doseNumber.value > totalDoses.value) {
			doseNumber.setErrors({dosesTooBig: true});
			return {dosesTooBig: true};
		} else {
			if (doseNumber.errors) {
				delete doseNumber.errors[Object.keys({dosesTooBig: true})[0]];
				if (Object.keys(doseNumber.errors).length === 0) {
					doseNumber.setErrors(null);
				}
			}
			return null;
		}
	};
}
