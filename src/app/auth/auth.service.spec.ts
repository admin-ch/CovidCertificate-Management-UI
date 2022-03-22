import {TestBed} from '@angular/core/testing';
import {of, ReplaySubject} from 'rxjs';
import {Claims, OauthService} from './oauth.service';
import {AuthFunction, AuthService} from "./auth.service";
import {ApiService} from "shared/api.service";
import SpyInstance = jest.SpyInstance;

describe('AuthService', () => {
	let service: AuthService;
	let apiService: ApiService;
	let oauthService: OauthService;

	let nextSpy: SpyInstance

	const authFunctionsMock: AuthFunction[] = [AuthFunction.MAIN, AuthFunction.CERTIFICATE_REVOCATION]
	let claimsMock: Claims;
	const oauthServiceClaims = new ReplaySubject<Claims>(1)

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: ApiService,
					useValue: {
						get: jest.fn().mockReturnValue(of(authFunctionsMock)),
					}
				},
				{
					provide: OauthService,
					useValue: {
						claims$: oauthServiceClaims.asObservable()
					}
				},
			]
		}).compileComponents();
		service = TestBed.inject(AuthService);
		apiService = TestBed.inject(ApiService);
		oauthService = TestBed.inject(OauthService);

	});

	beforeEach(() => {
		// @ts-ignore
		nextSpy = jest.spyOn(service.authorizedFunctions, 'next')
		claimsMock = {userroles: [AuthFunction.MAIN, AuthFunction.CERTIFICATE_REVOCATION]} as Claims
	})


	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('authorizedFunctions$', () => {
		it('should be defined', () => {
			expect(service.authorizedFunctions$).toBeDefined();
		});

	});

	describe('hasAuthorizationFor$', () => {
		it.each<[AuthFunction, AuthFunction[], boolean]>([
			[AuthFunction.MAIN, [AuthFunction.MAIN], true],
			[AuthFunction.MAIN, [AuthFunction.MAIN, AuthFunction.BULK_OPERATIONS], true],
			[AuthFunction.BULK_OPERATIONS, [AuthFunction.MAIN, AuthFunction.BULK_OPERATIONS], true],
			[AuthFunction.MAIN, [], false],
			[AuthFunction.MAIN, [AuthFunction.BULK_OPERATIONS], false],
			[AuthFunction.MAIN, [AuthFunction.BULK_OPERATIONS, AuthFunction.CERTIFICATE_REVOCATION], false],
			['MAIN' as AuthFunction, [AuthFunction.MAIN], false],
			['' as AuthFunction, [], false],
			// @ts-ignore
		])('when neededIdentifier is %s, and current AuthFunctions are %s, should emit  %s', (neededIdentifier, currentAuthFunctions, expected, done) => {
			service.hasAuthorizationFor$(neededIdentifier).subscribe(received => {
				expect(received).toBe(expected)
				done()
			})

			// @ts-ignore
			service.authorizedFunctions.next(currentAuthFunctions)
		})
	});

	describe('oauthService.claims$', () => {

		beforeEach(() => {
			nextSpy.mockReset()
		})

		it.each<[Claims | null, AuthFunction[]]>([
			[null, null],
			[{} as Claims, null],
			[{userroles: null} as Claims, null],
			[{userroles: []} as Claims, null],
			[{userroles: ['not', 'empty']} as Claims, authFunctionsMock],

		])('when claims is %s, should call next with %s', (claims, expected) => {
			oauthServiceClaims.next(claims)
			if (expected) {
				// @ts-ignore
				expect(nextSpy).toHaveBeenCalledWith(expected)
			} else {
				expect(nextSpy).not.toHaveBeenCalled()
			}
		})

	})
});
