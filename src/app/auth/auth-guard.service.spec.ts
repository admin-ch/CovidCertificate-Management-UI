import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ReplaySubject} from 'rxjs';
import {ObliqueTestingModule} from '@oblique/oblique';
import {AuthGuardService, Role} from './auth-guard.service';
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

	describe('Role enum', () => {
		it('should have the correct value for CERTIFICATE_CREATOR', () => {
			expect(Role.CERTIFICATE_CREATOR).toBe('bag-cc-certificatecreator');
		});
		it('should have the correct value for SUPER_USER', () => {
			expect(Role.SUPER_USER).toBe('bag-cc-superuser');
		});
		it('should have the correct value for HIN', () => {
			expect(Role.HIN).toBe('bag-cc-hin');
		});
		it('should have the correct value for HINCODE', () => {
			expect(Role.HINCODE).toBe('bag-cc-hincode');
		});
		it('should have the correct value for HIN_EPR', () => {
			expect(Role.HIN_EPR).toBe('bag-cc-hin-epr');
		});
		it('should have the correct value for PERSONAL', () => {
			expect(Role.PERSONAL).toBe('bag-cc-personal');
		});
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
			describe('With Superuser role', () => {
				beforeEach(() => {
					window = Object.create(window);
					Object.defineProperty(window, 'location', {
						value: {
							href: ''
						}
					});

					mock.claims$.next({userroles: ['bag-cc-certificatecreator', 'bag-cc-superuser']});

					mock.hasUserRole.mockImplementation(
						(role: string) => role === Role.CERTIFICATE_CREATOR || role === Role.SUPER_USER
					);
				});
				it('should give access', done => {
					service[fn](null).subscribe(result => {
						expect(result).toBeTruthy();
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
		});

		describe('HIN', () => {
			describe('Without hincode and personal', () => {
				beforeEach(() => {
					mock.claims$.next({userroles: ['bag-cc-certificatecreator', 'bag-cc-hin']});

					mock.hasUserRole.mockImplementation(
						(role: string) => role === Role.CERTIFICATE_CREATOR || role === Role.HIN
					);
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

			describe('With hincode and personal', () => {
				beforeEach(() => {
					mock.claims$.next({
						userroles: ['bag-cc-certificatecreator', 'bag-cc-hin', 'bag-cc-hincode', 'bag-cc-personal']
					});

					mock.hasUserRole.mockImplementation(
						(role: string) =>
							role === Role.CERTIFICATE_CREATOR ||
							role === Role.HIN ||
							role === Role.HINCODE ||
							role === Role.PERSONAL
					);
				});

				it('should return true', done => {
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
		});

		describe('HIN-EPR', () => {
			describe('Without hincode and personal', () => {
				beforeEach(() => {
					mock.claims$.next({userroles: ['bag-cc-certificatecreator', 'bag-cc-hin-epr']});

					mock.hasUserRole.mockImplementation(
						(role: string) => role === Role.CERTIFICATE_CREATOR || role === Role.HIN_EPR
					);
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

			describe('With hincode and personal', () => {
				beforeEach(() => {
					mock.claims$.next({
						userroles: ['bag-cc-certificatecreator', 'bag-cc-hin-epr', 'bag-cc-hincode', 'bag-cc-personal']
					});

					mock.hasUserRole.mockImplementation(
						(role: string) =>
							role === Role.CERTIFICATE_CREATOR ||
							role === Role.HIN_EPR ||
							role === Role.HINCODE ||
							role === Role.PERSONAL
					);
				});

				it('should return true', done => {
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
