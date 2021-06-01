import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ReplaySubject} from 'rxjs';
import {ObliqueTestingModule} from '@oblique/oblique';
import {AuthGuardService} from './auth-guard.service';
import {OauthService} from './oauth.service';
import {AutoLoginComponent} from './auto-login.component';

describe('AuthGuardService', () => {
	let service: AuthGuardService;
	let auth: OauthService;
	let router: Router;
	const mock = {
		claims$: new ReplaySubject(1),
		hasUserRole: jest.fn()
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule.withRoutes([{path: 'auth/auto-login', component: AutoLoginComponent}]),
				ObliqueTestingModule
			],
			declarations: [AutoLoginComponent],
			providers: [
				{provide: OauthService, useValue: mock},
				{provide: TranslateService, useValue: {currentLang: 'en'}}
			]
		}).compileComponents();
		service = TestBed.inject(AuthGuardService);
		auth = TestBed.inject(OauthService);
		router = TestBed.inject(Router);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	const runTest = (fn: string) => {
		describe('without claims', () => {
			beforeEach(() => {
				mock.claims$.next(undefined);
			});

			it('should return false', done => {
				service[fn](null).subscribe(a => {
					expect(a).toBe(false);
					done();
				});
			});

			it('should navigate to auto-login', done => {
				jest.spyOn(router, 'navigate');
				service[fn](null).subscribe((_: any) => {
					expect(router.navigate).toHaveBeenCalledWith(['auth/auto-login']);
					done();
				});
			});
		});

		describe('Unauthorized', () => {
			beforeEach(() => {
				window = Object.create(window);
				Object.defineProperty(window, 'location', {
					value: {
						href: ''
					}
				});
				mock.claims$.next({});
				jest.spyOn(auth, 'hasUserRole').mockReturnValue(false);
			});

			it('should return false', done => {
				service[fn](null).subscribe(a => {
					expect(a).toBe(false);
					done();
				});
			});

			it('should not navigate', done => {
				jest.spyOn(router, 'navigate');
				service[fn](null).subscribe(() => {
					expect(router.navigate).not.toHaveBeenCalled();
					done();
				});
			});

			it('should redirect to auto-login', done => {
				service.canLoad(null).subscribe(() => {
					expect(window.location.href).toEqual('https://www.eiam.admin.ch/403ggg?l=en&stage=');
					done();
				});
			});
		});

		describe('Superuser', () => {
			describe('Without strong authentication', () => {
				beforeEach(() => {
					window = Object.create(window);
					Object.defineProperty(window, 'location', {
						value: {
							href: ''
						}
					});

					mock.claims$.next({userroles: ['bag-cc-certificatecreator', 'bag-cc-superuser']});

					jest.spyOn(auth, 'hasUserRole')
						.mockReturnValueOnce(true)
						.mockReturnValueOnce(true)
						.mockReturnValue(false);
				});
				it('should not give access', done => {
					service[fn](null).subscribe(result => {
						expect(result).toBeFalsy();
						done();
					});
				});
				it('should redirect to eiam page', done => {
					service[fn](null).subscribe(() => {
						expect(window.location.href).toEqual('https://www.eiam.admin.ch/qoaggg?l=en&stage=');
						done();
					});
				});
			});

			describe('With strong authentication', () => {
				beforeEach(() => {
					window = Object.create(window);
					Object.defineProperty(window, 'location', {
						value: {
							href: ''
						}
					});

					mock.claims$.next({userroles: ['bag-cc-certificatecreator', 'bag-cc-superuser']});

					jest.spyOn(auth, 'hasUserRole').mockReturnValue(true);
				});
				it('should give access', done => {
					service[fn](null).subscribe(result => {
						expect(result).toBeTruthy();
						done();
					});
				});
				it('should not navigate', done => {
					jest.spyOn(router, 'navigate');
					service[fn](null).subscribe(() => {
						expect(router.navigate).not.toHaveBeenCalled();
						done();
					});
				});
			});
		});

		describe('With HIN & CH-Login', () => {
			beforeEach(() => {
				mock.claims$.next({homeName: 'E-ID CH-LOGIN', unitName: 'HIN'});
				jest.spyOn(auth, 'hasUserRole').mockReturnValue(true);
			});

			it('should return false', done => {
				service[fn](null).subscribe(a => {
					expect(a).toBe(false);
					done();
				});
			});

			it('should not navigate', done => {
				jest.spyOn(router, 'navigate');
				service[fn](null).subscribe(() => {
					expect(router.navigate).not.toHaveBeenCalled();
					done();
				});
			});

			it('should redirect to auto-login', done => {
				service.canLoad(null).subscribe(() => {
					expect(window.location.href).toEqual('https://www.eiam.admin.ch/chloginforbidden?l=en&stage=');
					done();
				});
			});
		});

		describe('Authorized', () => {
			beforeEach(() => {
				mock.claims$.next({});
				jest.spyOn(auth, 'hasUserRole').mockReturnValue(true);
			});

			it('should return false', done => {
				service[fn](null).subscribe(a => {
					expect(a).toBe(true);
					done();
				});
			});

			it('should not navigate', done => {
				jest.spyOn(router, 'navigate');
				service[fn](null).subscribe(() => {
					expect(router.navigate).not.toHaveBeenCalled();
					done();
				});
			});
		});
	};

	describe('canActivate', () => runTest('canActivate'));
	describe('canActivateChild', () => runTest('canActivateChild'));
	describe('canLoad', () => runTest('canLoad'));
});
