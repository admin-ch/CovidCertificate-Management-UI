import {TestBed} from '@angular/core/testing';
import {ApiService} from './api.service';
import {FeatureToggleService} from "shared/feature.toggle.service";

describe('FeatureToggleService', () => {
	let service: FeatureToggleService;
	let api: ApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{provide: ApiService, useValue: {post: jest.fn(), get: jest.fn()}}]
		});
		service = TestBed.inject(FeatureToggleService);
		api = TestBed.inject(ApiService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should get the value sets with the correct URL', () => {
		service.getFeatureToggle();
		expect(api.get).toHaveBeenCalledWith('feature-toggle/features');
	});
});
