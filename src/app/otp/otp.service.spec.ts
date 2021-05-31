import {TestBed} from '@angular/core/testing';
import {OtpService} from './otp.service';
import {ApiService} from 'shared/api.service';

describe('OtpService', () => {
	let service: OtpService;

	const mockApiService = {postText: jest.fn()};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{provide: ApiService, useValue: mockApiService}]
		});
		service = TestBed.inject(OtpService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should call the correct URL for OTP generation', () => {
		service.generateOtp();
		expect(mockApiService.postText).toHaveBeenCalledWith('otp', null);
	});
});
