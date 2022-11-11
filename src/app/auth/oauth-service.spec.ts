import {TestBed, fakeAsync} from '@angular/core/testing';
import {EMPTY, of} from 'rxjs';
import {skip} from 'rxjs/operators';
import {AbstractLoggerService, OidcSecurityService} from 'angular-auth-oidc-client';
import {OauthService} from './oauth.service';
import {OpenIdConfigService} from './open-id-config-service';

describe('OauthService', () => {
	let service: OauthService;
	let auth: OidcSecurityService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: OidcSecurityService,
					useValue: {
						logoff: jest.fn(),
						authorize: jest.fn(),
						checkAuth: jest.fn().mockReturnValue(EMPTY),
						isAuthenticated$: of(false),
						userData$: of(EMPTY)
					}
				},
				{provide: OpenIdConfigService, useValue: {autoLogin: true}},
				{provide: AbstractLoggerService, useValue: {logDebug: jest.fn()}}
			]
		}).compileComponents();
		service = TestBed.inject(OauthService);
		auth = TestBed.inject(OidcSecurityService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('claims$', () => {
		it('should be defined', () => {
			expect(service.claims$).toBeDefined();
		});
	});

	describe('isAuthenticated$', () => {
		it('should be defined', () => {
			expect(service.isAuthenticated$).toBeDefined();
		});
	});

	describe('name$', () => {
		it('should be defined', () => {
			expect(service.name$).toBeDefined();
		});

		it('should not emit if no claims', fakeAsync(() => {
			let name;
			// @ts-ignore
			service.claims.next(undefined);
			service.name$.subscribe(n => (name = n));
			skip(1000);
			expect(name).toBeUndefined();
		}));

		it('should emit name if present', done => {
			// @ts-ignore
			service.claims.next({name: 'test'});
			service.name$.subscribe(name => {
				expect(name).toBe('test');
				done();
			});
		});

		it('should emit displayName if present', done => {
			// @ts-ignore
			service.claims.next({name: 'test', displayName: 'test2'});
			service.name$.subscribe(name => {
				expect(name).toBe('test2');
				done();
			});
		});
	});

	describe('login', () => {
		it('should call authorize', () => {
			service.login();
			expect(auth.authorize).toHaveBeenCalled();
		});
	});

	describe('logout', () => {
		it('should call logoff', () => {
			service.logout();
			expect(auth.logoff).toHaveBeenCalled();
		});
	});

	describe('initialize', () => {
		it('should call authorizedCallbackWithCode', () => {
			service.initialize();
			expect(auth.checkAuth).toHaveBeenCalled();
		});
	});

	describe('loadClaims', () => {
		it('should receive from isAuthenticated$', done => {
			service.loadClaims();
			auth.isAuthenticated$.subscribe(isAuthenticated => {
				expect(isAuthenticated).toBe(false);
				done();
			});
		});

		describe('unauthorized', () => {
			beforeEach(() => {
				// @ts-ignore
				auth.isAuthenticated$ = of(false);
				// @ts-ignore
				auth.userData$ = of({userData: {}});
			});
			describe('with autoLogin', () => {
				it('should call authorize', () => {
					service.loadClaims();
					expect(auth.authorize).toHaveBeenCalled();
				});
				it('should emit isAuthenticated false', done => {
					service.loadClaims();
					service.isAuthenticated$.subscribe(r => {
						expect(r).toBe(false);
						done();
					});
				});
				it('should emit isAuthenticated', () => {
					// @ts-ignore
					spyOn(service.isAuthenticated, 'next');
					service.loadClaims();
					// @ts-ignore
					expect(service.isAuthenticated.next).toHaveBeenCalledWith(false);
				});
				it('should not emit claims', () => {
					// @ts-ignore
					spyOn(service.claims, 'next');
					service.loadClaims();
					// @ts-ignore
					expect(service.claims.next).not.toHaveBeenCalled();
				});
			});
			describe('without autoLogin', () => {
				beforeEach(() => {
					const config = TestBed.inject(OpenIdConfigService);
					Object.defineProperty(config, 'autoLogin', {value: false});
				});
				it('should not call authorize', () => {
					service.loadClaims();
					expect(auth.authorize).not.toHaveBeenCalled();
				});
				it('should emit isAuthenticated false', done => {
					service.loadClaims();
					service.isAuthenticated$.subscribe(r => {
						expect(r).toBe(false);
						done();
					});
				});
				it('should emit isAuthenticated', () => {
					// @ts-ignore
					spyOn(service.isAuthenticated, 'next');
					service.loadClaims();
					// @ts-ignore
					expect(service.isAuthenticated.next).toHaveBeenCalledWith(false);
				});
				it('should emit claims', done => {
					service.claims$.subscribe(claims => {
						expect(claims).toBe(undefined);
						done();
					});
					service.loadClaims();
				});
			});
		});

		describe('authorized', () => {
			beforeEach(() => {
				// @ts-ignore
				auth.isAuthenticated$ = of(true);
			});
			it('should emit isAuthenticated true', done => {
				service.loadClaims();
				service.isAuthenticated$.subscribe(r => {
					expect(r).toBe(true);
					done();
				});
			});
			it('should emit isAuthenticated', () => {
				// @ts-ignore
				spyOn(service.isAuthenticated, 'next');
				service.loadClaims();
				// @ts-ignore
				expect(service.isAuthenticated.next).toHaveBeenCalled();
			});

			it('should emit empty claims with no user data', done => {
				// @ts-ignore
				auth.userData$ = of({userData: undefined});
				service.claims$.subscribe(claims => {
					expect(claims).toEqual({});
					done();
				});
				service.loadClaims();
			});

			it('should emit claims with user data', done => {
				const testClaims = {test: 'test'};
				// @ts-ignore
				auth.userData$ = of({userData: testClaims});
				service.claims$.subscribe(claims => {
					expect(claims).toEqual(testClaims);
					done();
				});
				service.loadClaims();
			});

			// describe('with autoLogin', () => {
			// 	it('should call authorize', () => {
			// 		service.loadClaims();
			// 		expect(auth.authorize).toHaveBeenCalled();
			// 	});
			// 	it('should not call getUserData', () => {
			// 		service.loadClaims();
			// 		expect(auth.getUserData).not.toHaveBeenCalled();
			// 	});
			// });
			// describe('without autoLogin', () => {
			// 	beforeEach(() => {
			// 		const config = TestBed.inject(OpenIdConfigService);
			// 		Object.defineProperty(config, 'autoLogin', {value: false});
			// 	});
			// 	it('should not call authorize', () => {
			// 		service.loadClaims();
			// 		expect(auth.authorize).not.toHaveBeenCalled();
			// 	});
			// 	it('should call getUserData', () => {
			// 		service.loadClaims();
			// 		expect(auth.getUserData).toHaveBeenCalled();
			// 	});
			// });
		});
	});

	describe('hasUserRole', () => {
		it('should return false without claims', () => {
			expect(service.hasUserRole('role', undefined)).toBe(false);
		});
		it('should return false without userroles', () => {
			expect(service.hasUserRole('role', {})).toBe(false);
		});
		it('should return false without "role" role', () => {
			expect(service.hasUserRole('role', {userroles: ['role']})).toBe(true);
		});
	});
});
