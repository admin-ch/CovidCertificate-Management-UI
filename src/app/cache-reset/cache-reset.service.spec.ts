import {TestBed} from '@angular/core/testing';

import {CacheResetService} from './cache-reset.service';

describe('CacheResetService', () => {
	let service: CacheResetService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CacheResetService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
