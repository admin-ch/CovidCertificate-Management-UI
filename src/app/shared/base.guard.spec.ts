import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {ReplaySubject, of} from 'rxjs';
import {AuthFunction, AuthService} from '../auth/auth.service';
import {ObliqueTestingModule, WINDOW} from '@oblique/oblique';
import {BaseGuard} from 'shared/base.guard';

describe('BaseGuard', () => {
	let service: BaseGuard;
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
		service = TestBed.inject(BaseGuard);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('checkExpectedRole', () => {
		describe('with expected return value true', () => {
			let spy: jest.SpyInstance;

			beforeEach(() => {
				// @ts-ignore
				service.window.location.href = '';
				spy = jest.spyOn(authServiceMock, 'hasAuthorizationFor$').mockReturnValue(of(true));
			});

			describe.each(Object.values(AuthFunction))('with auth function %s ', authFunction => {
				it(`should return true`, done => {
					const obs$ = service.checkExpectedRole(authFunction);

					obs$.subscribe(value => {
						expect(value).toBe(true);
						done();
					});
				});
				it(`should call hasAuthorizationFor$ with ${authFunction}`, done => {
					const obs$ = service.checkExpectedRole(authFunction);

					obs$.subscribe(() => {
						expect(spy).toHaveBeenCalledWith(authFunction);
						done();
					});
				});

				it(`should not reroute the user`, done => {
					const obs$ = service.checkExpectedRole(authFunction);

					obs$.subscribe(() => {
						expect(spy).toHaveBeenCalledWith(authFunction);
						// @ts-ignore
						expect(service.window.location.href).toBe('');
						done();
					});
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

			describe.each(Object.values(AuthFunction))('with auth function %s ', authFunction => {
				it(`should return false`, done => {
					const obs$ = service.checkExpectedRole(authFunction);

					obs$.subscribe(value => {
						expect(value).toBe(false);
						done();
					});
				});
				it(`should call hasAuthorizationFor$ with ${authFunction}`, done => {
					const obs$ = service.checkExpectedRole(authFunction);

					obs$.subscribe(() => {
						expect(spy).toHaveBeenCalledWith(authFunction);
						done();
					});
				});

				it(`should reroute the user`, done => {
					const obs$ = service.checkExpectedRole(authFunction);
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
});
