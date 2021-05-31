import {TestBed} from '@angular/core/testing';
import {RevocationService} from './revocation.service';
import {ApiService} from 'shared/api.service';

describe('RevocationService', () => {
	let service: RevocationService;

	const mockApiService = {post: jest.fn()};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{provide: ApiService, useValue: mockApiService}]
		});
		service = TestBed.inject(RevocationService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should call the correct URL for revocation', () => {
		service.revoke({uvci: '42'});
		expect(mockApiService.post).toHaveBeenCalledWith('revocation', {uvci: '42'});
	});
});
