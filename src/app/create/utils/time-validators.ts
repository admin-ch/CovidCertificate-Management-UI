import {AbstractControl} from '@angular/forms';

export class TimeValidators {
	static validateTime() {
		return (control: AbstractControl): {[key: string]: boolean} | null => {
			const isValid = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])?$/.test(control.value?.time);

			if (!isValid) {
				return {timeInvalid: true};
			}

			return null;
		};
	}
}
