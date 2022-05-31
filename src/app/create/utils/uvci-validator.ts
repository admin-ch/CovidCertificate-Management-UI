import {AbstractControl, ValidationErrors} from '@angular/forms';

export const uvciValidator = (control: AbstractControl): ValidationErrors | null => {
	if (!(control.value as string)?.match(/^urn:uvci:01:CH:\d{24}$/g)) {
		return {
			format: true
		}
	}
	return null;
}
