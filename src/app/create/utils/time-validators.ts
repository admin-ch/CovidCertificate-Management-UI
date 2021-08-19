import {AbstractControl} from '@angular/forms';

export class TimeValidators {
	static validateTime() {
		return (control: AbstractControl): {[key: string]: boolean} | null => {
			// the second regex validates times with AM/PM this is only needed to validate times entered in a polyfilled time field
			const isValid =
				/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])?$/.test(control.value?.time) ||
				/^(1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm])$/.test(control.value?.time);

			if (!isValid) {
				return {timeInvalid: true};
			}

			return null;
		};
	}
}
