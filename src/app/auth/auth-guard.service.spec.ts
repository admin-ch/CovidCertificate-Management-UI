import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {ReplaySubject, of} from 'rxjs';
import {AuthFunction, AuthService} from './auth.service';
import {WINDOW} from '@oblique/oblique';
import {AuthGuardService} from './auth-guard.service';
import {OauthService} from './oauth.service';
import {AutoLoginComponent} from './auto-login.component';

describe('AuthGuardService', () => {
	let service: AuthGuardService;
	const oauthServiceMock = {
		claims$: new ReplaySubject(1),
		hasUserRole: jest.fn(),
		isAuthenticated$: of({isAuthenticated: true})
	};
	const hasAuthorizationForMock = new ReplaySubject(1);
	const hasAuthorizationForObsMock = hasAuthorizationForMock.asObservable();
	const hasAuthorizationFor$Mock = jest.fn().mockReturnValue(hasAuthorizationForObsMock);
	const authServiceMock = {
		hasAuthorizationFor$: hasAuthorizationFor$Mock
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule.withRoutes([{path: 'auth/auto-login', component: AutoLoginComponent}])],
			declarations: [AutoLoginComponent],
			providers: [
				{provide: AuthService, useValue: authServiceMock},
				{
					provide: WINDOW,
					useValue: {
						location: {
							href: ''
						}
					}
				},
				{provide: OauthService, useValue: oauthServiceMock},
				{provide: TranslateService, useValue: {currentLang: 'en'}}
			]
		}).compileComponents();
		service = TestBed.inject(AuthGuardService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe.each(['canActivate', 'canActivateChild', 'canLoad'])('%s', name => {
		describe('with expected return value true', () => {
			let spy: jest.SpyInstance;

			beforeEach(() => {
				// @ts-ignore
				service.window.location.href = '';
				spy = jest.spyOn(authServiceMock, 'hasAuthorizationFor$').mockReturnValue(of(true));
			});

			it(`should return true`, done => {
				const obs$ = service[name]();

				obs$.subscribe(value => {
					expect(value).toBe(true);
					done();
				});
			});
			it(`should call hasAuthorizationFor$ with ${AuthFunction.MAIN}`, done => {
				const obs$ = service[name]();

				obs$.subscribe(() => {
					expect(spy).toHaveBeenCalledWith(AuthFunction.MAIN);
					done();
				});
			});

			it(`should not reroute the user`, done => {
				const obs$ = service[name]();

				obs$.subscribe(() => {
					expect(spy).toHaveBeenCalledWith(AuthFunction.MAIN);
					// @ts-ignore
					expect(service.window.location.href).toBe('');
					done();
				});
			});
		});

		describe('with expected return value false', () => {
			let spy: jest.SpyInstance;

			beforeEach(() => {
				// @ts-ignore
				service.window.location.href = '';
				spy = jest.spyOn(authServiceMock, 'hasAuthorizationFor$').mockReturnValue(of(false));
			});

			it(`should return false`, done => {
				const obs$ = service[name]();

				obs$.subscribe(value => {
					expect(value).toBe(false);
					done();
				});
			});
			it(`should call hasAuthorizationFor$ with ${AuthFunction.MAIN}`, done => {
				const obs$ = service[name]();

				obs$.subscribe(() => {
					expect(spy).toHaveBeenCalledWith(AuthFunction.MAIN);
					done();
				});
			});

			it(`should reroute the user`, done => {
				const obs$ = service[name]();
				// @ts-ignore
				service.stage = 'stage';

				obs$.subscribe(() => {
					// @ts-ignore
					expect(service.window.location.href).toBe(`https://www.eiam.admin.ch/403ggg?l=${service.translate.currentLang}&stage=${service.stage}`);
					done();
				});
			});
		});
	});
});
