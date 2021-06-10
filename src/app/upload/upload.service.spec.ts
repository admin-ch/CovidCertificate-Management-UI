import {TestBed} from '@angular/core/testing';
import {UploadService} from './upload.service';
import {ApiService} from 'shared/api.service';
import {GenerationType} from 'shared/model';

describe('UploadService', () => {
	let service: UploadService;

	const mockApiService = {post: jest.fn()};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{provide: ApiService, useValue: mockApiService}]
		});
		service = TestBed.inject(UploadService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should call the correct URL for file upload', () => {
		const testFile = new File([], 'test');
		const formData = new FormData();
		formData.append('file', testFile);
		formData.append('certificateType', GenerationType.VACCINATION);

		service.uploadSelectedFile(testFile, GenerationType.VACCINATION);

		expect(mockApiService.post).toHaveBeenCalledWith('covidcertificate/csv', formData);
	});
});
