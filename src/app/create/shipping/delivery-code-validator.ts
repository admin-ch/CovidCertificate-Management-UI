import {AbstractControl} from '@angular/forms';

export class DeliveryCodeValidatorValidators {
	private static readonly codePoints: string = '1234567890ABCDEFHKMNPRSTUWXYZ';

	static validateAppDeliveryCode() {
		return (control: AbstractControl): {[key: string]: boolean} | null => {
			const appDeliveryCode: string = control?.value;

			if (!appDeliveryCode) {
				return null;
			}

			let factor = 1;
			let sum = 0;
			const n = DeliveryCodeValidatorValidators.numberOfValidInputCharacters();

			for (let i = appDeliveryCode.length - 1; i >= 0; i--) {
				const addend =
					factor * DeliveryCodeValidatorValidators.codePointFromCharacter(appDeliveryCode.charAt(i));
				factor = factor === 2 ? 1 : 2;
				sum += Math.floor(addend / n) + (addend % n);
			}

			if (sum % n !== 0) {
				return {invalidAppDeliveryCode: true};
			}

			return null;
		};
	}

	private static numberOfValidInputCharacters(): number {
		return DeliveryCodeValidatorValidators.codePoints.length;
	}

	private static codePointFromCharacter(character): number {
		return DeliveryCodeValidatorValidators.codePoints.indexOf(character);
	}
}
