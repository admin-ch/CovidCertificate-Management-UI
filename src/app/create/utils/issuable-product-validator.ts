import {AbstractControl, UntypedFormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export class IssuableProductValidator {
	static validateProduct: ValidatorFn = (form: UntypedFormGroup): ValidationErrors | null => {
		const medicalProduct: AbstractControl = form.get('medicalProduct');
		const countryOfVaccination: AbstractControl = form.get('countryOfVaccination');
		if (
			medicalProduct?.value &&
			countryOfVaccination &&
			countryOfVaccination.value &&
			medicalProduct.value.issuable === 'ABROAD_ONLY' &&
			countryOfVaccination.value.code === 'CH'
		) {
			medicalProduct.setErrors({notIssuableInSwitzerland: true});
			return {notIssuableInSwitzerland: true};
		}
		if (medicalProduct.errors) {
			delete medicalProduct.errors[Object.keys({notIssuableInSwitzerland: true})[0]];
			if (Object.keys(medicalProduct.errors).length === 0) {
				medicalProduct.setErrors(null);
			}
		}
		return null;
	};
}
