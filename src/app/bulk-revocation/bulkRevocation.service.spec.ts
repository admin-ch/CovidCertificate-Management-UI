import {TestBed} from '@angular/core/testing';
import {BulkRevocationService} from './bulkRevocation.service';
import {ApiService} from 'shared/api.service';

describe('BulkRevocationService', () => {
	let service: BulkRevocationService;

	const mockApiService = {post: jest.fn()};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{provide: ApiService, useValue: mockApiService}]
		});
		service = TestBed.inject(BulkRevocationService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should call the correct URL for file upload', () => {
		const testFile = new File([], 'test');
		const formData = new FormData();
		formData.append('file', testFile);

		service.uploadSelectedFile(testFile);

		expect(mockApiService.post).toHaveBeenCalledWith('revocation/csv', formData);
	});
});
