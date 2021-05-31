import {TestBed} from '@angular/core/testing';

import {CreationDataService} from './creation-data.service';

describe('CreationDataService', () => {
	let service: CreationDataService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CreationDataService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
