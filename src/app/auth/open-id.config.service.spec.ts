import {OpenIdConfigService} from './open-id-config-service';

describe('OpenIdConfigService', () => {
	let service: OpenIdConfigService;

	beforeEach(() => {
		service = new OpenIdConfigService();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should have a stsStagingUrl property', () => {
		expect(service.authorityUrl).toBeDefined();
	});

	it('should have a autoLogin property', () => {
		expect(service.autoLogin).toBeDefined();
	});

	it('should have an urlPattern property', () => {
		expect(service.urlPattern).toBeDefined();
	});
});
