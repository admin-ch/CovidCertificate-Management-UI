import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthFunction} from '../auth/auth.service';
import {ObliqueTestingModule} from '@oblique/oblique';
import {UploadGuard} from './upload.guard';
import {BaseGuard} from "shared/base.guard";

describe('UploadGuard', () => {
	let service: UploadGuard;
	const checkExpectedRoleMock = jest.fn().mockReturnValue('mockReturnValue')

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, ObliqueTestingModule],
			providers: [
				{
					provide: BaseGuard,
					useValue: {
						checkExpectedRole: checkExpectedRoleMock
					}
				},
			]
		}).compileComponents();
		service = TestBed.inject(UploadGuard);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe.each(['canActivate', 'canActivateChild', 'canLoad'])('%s', name => {

		it(`should return value of checkExpectedRole`, () => {
			expect(service[name]()).toBe('mockReturnValue')
		})

		it(`should call ${name} with ${AuthFunction.BULK_OPERATIONS}`, () => {
			service[name]()
			expect(checkExpectedRoleMock).toHaveBeenCalledWith(AuthFunction.BULK_OPERATIONS)
		})

	});
});
