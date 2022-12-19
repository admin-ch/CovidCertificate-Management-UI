import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthFunction} from '../auth/auth.service';
import {BaseGuard} from 'shared/base.guard';
import {CertificateRevokeGuard} from './certificate-revoke.guard';

describe('CertificateRevokeGuard', () => {
	let service: CertificateRevokeGuard;
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
		service = TestBed.inject(CertificateRevokeGuard);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe.each(['canActivate', 'canActivateChild', 'canLoad'])('%s', name => {
		it(`should return value of checkExpectedRole`, () => {
			expect(service[name]()).toBe('mockReturnValue');
		});

		it(`should call ${name} with ${AuthFunction.CERTIFICATE_REVOCATION}`, () => {
			service[name]();
			expect(checkExpectedRoleMock).toHaveBeenCalledWith(AuthFunction.CERTIFICATE_REVOCATION);
		});
	});
});
