import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthFunction} from '../auth/auth.service';
import {ReportGuard} from './report.guard';
import {BaseGuard} from 'shared/base.guard';

describe('ReportGuard', () => {
	let service: ReportGuard;
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
		service = TestBed.inject(ReportGuard);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe.each(['canActivate', 'canActivateChild', 'canLoad'])('%s', name => {
		it(`should return value of checkExpectedRole`, () => {
			expect(service[name]()).toBe('mockReturnValue');
		});

		it(`should call ${name} with ${AuthFunction.REPORTING_SELF_SERVICE}`, () => {
			service[name]();
			expect(checkExpectedRoleMock).toHaveBeenCalledWith(AuthFunction.REPORTING_SELF_SERVICE);
		});
	});
});
