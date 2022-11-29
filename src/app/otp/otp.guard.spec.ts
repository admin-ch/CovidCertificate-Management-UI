import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthFunction} from '../auth/auth.service';

import {BaseGuard} from 'shared/base.guard';
import {OtpGuard} from './otp.guard';

describe('OtpGuard', () => {
	let service: OtpGuard;
	const checkExpectedRoleMock = jest.fn().mockReturnValue('mockReturnValue');

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				{
					provide: BaseGuard,
					useValue: {
						checkExpectedRole: checkExpectedRoleMock
					}
				}
			]
		}).compileComponents();
		service = TestBed.inject(OtpGuard);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe.each(['canActivate', 'canActivateChild', 'canLoad'])('%s', name => {
		it(`should return value of checkExpectedRole`, () => {
			expect(service[name]()).toBe('mockReturnValue');
		});

		it(`should call ${name} with ${AuthFunction.OTP_GENERATION}`, () => {
			service[name]();
			expect(checkExpectedRoleMock).toHaveBeenCalledWith(AuthFunction.OTP_GENERATION);
		});
	});
});
