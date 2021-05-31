import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {AutoLoginComponent} from './auto-login.component';
import {OauthService} from './oauth.service';

describe('AutoLoginComponent', () => {
	const mock = {authorize: jest.fn()};
	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [AutoLoginComponent],
			providers: [
				{provide: OidcSecurityService, useValue: mock},
				{provide: OauthService, useValue: {setup$: of(true)}}
			]
		}).compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(AutoLoginComponent);
		const component = fixture.debugElement.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should call authorize once', () => {
		expect(mock.authorize).toHaveBeenCalled();
	});
});
