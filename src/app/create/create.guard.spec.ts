import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {of, ReplaySubject} from 'rxjs';
import {AuthFunction, AuthService} from '../auth/auth.service';
import {CreateGuard} from './create.guard';
import {ObliqueTestingModule, WINDOW} from '@oblique/oblique';

describe('CreateGuard', () => {
	let service: CreateGuard;
	let router: Router;
	const hasAuthorizationForMock = new ReplaySubject(1);
	const hasAuthorizationForObsMock = hasAuthorizationForMock.asObservable();
	const hasAuthorizationFor$Mock = jest.fn().mockReturnValue(hasAuthorizationForObsMock);
	const authServiceMock = {
		hasAuthorizationFor$: hasAuthorizationFor$Mock
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, ObliqueTestingModule],
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
				{provide: TranslateService, useValue: {currentLang: 'en'}}
			]
		}).compileComponents();
		service = TestBed.inject(CreateGuard);
		router = TestBed.inject(Router);
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
			it(`should call hasAuthorizationFor$ with ${AuthFunction.CERTIFICATE_GENERATION}`, done => {
				const obs$ = service[name]();

				obs$.subscribe(_ => {
					expect(spy).toHaveBeenCalledWith(AuthFunction.CERTIFICATE_GENERATION);
					done();
				});
			});

			it(`should not reroute the user`, done => {
				const obs$ = service[name]();

				obs$.subscribe(() => {
					expect(spy).toHaveBeenCalledWith(AuthFunction.CERTIFICATE_GENERATION);
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
			it(`should call hasAuthorizationFor$ with ${AuthFunction.CERTIFICATE_GENERATION}`, done => {
				const obs$ = service[name]();

				obs$.subscribe(_ => {
					expect(spy).toHaveBeenCalledWith(AuthFunction.CERTIFICATE_GENERATION);
					done();
				});
			});

			it(`should reroute the user`, done => {
				const obs$ = service[name]();
				// @ts-ignore
				service.stage = 'stage';

				obs$.subscribe(() => {
					// @ts-ignore
					expect(service.window.location.href).toBe(
						// @ts-ignore
						`https://www.eiam.admin.ch/403ggg?l=${service.translate.currentLang}&stage=${service.stage}`
					);
					done();
				});
			});
		});
	});
});
