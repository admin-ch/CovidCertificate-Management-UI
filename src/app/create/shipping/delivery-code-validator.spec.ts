import {FormControl} from '@angular/forms';
import {DeliveryCodeValidatorValidators} from './delivery-code-validator';

describe('DeliveryCodeValidatorValidators', () => {
	const control = new FormControl('input');

	describe('validateAppDeliveryCode', () => {
		it('should validate null value correctly', () => {
			control.setValue(null);
			const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
			expect(test(control)).toBeNull();
		});

		describe('valid values', () => {
			it('should validate Y8P8ECFN8 correctly', () => {
				control.setValue('Y8P8ECFN8');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});

			it('should validate HDTYRB66W correctly', () => {
				control.setValue('HDTYRB66W');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});

			it('should validate YS6R7H88T correctly', () => {
				control.setValue('YS6R7H88T');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});

			it('should validate K42K6F7R2 correctly', () => {
				control.setValue('K42K6F7R2');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});

			it('should validate 3BY8DAZYS correctly', () => {
				control.setValue('3BY8DAZYS');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});

			it('should validate ADWYF11SY correctly', () => {
				control.setValue('ADWYF11SY');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});

			it('should validate 453S6HUA6 correctly', () => {
				control.setValue('453S6HUA6');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});

			it('should validate WR7UPHB4A correctly', () => {
				control.setValue('WR7UPHB4A');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});

			it('should validate 37WDPRSKM correctly', () => {
				control.setValue('37WDPRSKM');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});

			it('should validate 01AWUUB2M correctly', () => {
				control.setValue('01AWUUB2M');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});

			it('should validate MA4S9CNUK correctly', () => {
				control.setValue('MA4S9CNUK');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});

			it('should validate SY7M684WA correctly', () => {
				control.setValue('SY7M684WA');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});

			it('should validate X216WN3YF correctly', () => {
				control.setValue('X216WN3YF');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});

			it('should validate 3C2YFKCNP correctly', () => {
				control.setValue('3C2YFKCNP');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});

			it('should validate TNKBZ0TSK correctly', () => {
				control.setValue('TNKBZ0TSK');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toBeNull();
			});
		});

		describe('invalid values', () => {
			it('should validate Y8P8ECFN2 correctly', () => {
				control.setValue('Y8P8ECFN2');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});

			it('should validate ADTYRB66W correctly', () => {
				control.setValue('ADTYRB66W');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});

			it('should validate Y16R7H88T correctly', () => {
				control.setValue('Y16R7H88T');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});

			it('should validate K42K6B7R2 correctly', () => {
				control.setValue('K42K6B7R2');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});

			it('should validate ZBY8DAZYS correctly', () => {
				control.setValue('ZBY8DAZYS');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});

			it('should validate A1WYF11SY correctly', () => {
				control.setValue('A1WYF11SY');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});

			it('should validate 45AS6HUA6 correctly', () => {
				control.setValue('45AS6HUA6');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});

			it('should validate WR7TPHB4A correctly', () => {
				control.setValue('WR7TPHB4A');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});

			it('should validate 37WDZRSKM correctly', () => {
				control.setValue('37WDZRSKM');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});

			it('should validate 01AWU9B2M correctly', () => {
				control.setValue('01AWU9B2M');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});

			it('should validate MA4S9C0UK correctly', () => {
				control.setValue('MA4S9C0UK');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});

			it('should validate SY7M684AA correctly', () => {
				control.setValue('SY7M684AA');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});

			it('should validate X216WN3Y1 correctly', () => {
				control.setValue('X216WN3Y1');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});

			it('should validate 3C2Y5KCNP correctly', () => {
				control.setValue('3C2Y5KCNP');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});

			it('should validate TNKBQ0TSK correctly', () => {
				control.setValue('TNKBQ0TSK');
				const test = DeliveryCodeValidatorValidators.validateAppDeliveryCode();
				expect(test(control)).toEqual({invalidAppDeliveryCode: true});
			});
		});
	});
});
