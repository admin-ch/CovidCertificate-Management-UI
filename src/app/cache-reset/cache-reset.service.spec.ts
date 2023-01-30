import {TestBed} from '@angular/core/testing';
import {CacheResetService} from './cache-reset.service';
import {ObNotificationService} from '@oblique/oblique';
import {ApiService} from 'shared/api.service';

describe('CacheResetService', () => {
	let service: CacheResetService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{provide: ObNotificationService, useValue: {}},
				{provide: ApiService, useValue: {}}
			]
		});
		service = TestBed.inject(CacheResetService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
