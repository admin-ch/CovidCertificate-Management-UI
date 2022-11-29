import {TestBed} from '@angular/core/testing';
import {ReplaySubject, of} from 'rxjs';
import {Claims, OauthService} from './oauth.service';
import {AuthFunction, AuthService} from './auth.service';
import {ApiService} from 'shared/api.service';
import {DataRoomCode} from 'shared/model';
import SpyInstance = jest.SpyInstance;

describe('AuthService', () => {
	let service: AuthService;

	let authorizedFunctionsNextSpy: SpyInstance;
	let authorizedDataRoomsNextSpy: SpyInstance;

	const authFunctionsMock: AuthFunction[] = [AuthFunction.MAIN, AuthFunction.CERTIFICATE_REVOCATION];
	const oauthServiceClaims = new ReplaySubject<Claims>(1);

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: ApiService,
					useValue: {
						get: jest.fn().mockReturnValue(of(authFunctionsMock))
					}
				},
				{
					provide: OauthService,
					useValue: {
						claims$: oauthServiceClaims.asObservable()
					}
				}
			]
		}).compileComponents();
		service = TestBed.inject(AuthService);
	});

	beforeEach(() => {
		// @ts-ignore
		authorizedFunctionsNextSpy = jest.spyOn(service.authorizedFunctions, 'next');
		// @ts-ignore
		authorizedDataRoomsNextSpy = jest.spyOn(service.authorizedDataRooms, 'next');
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('authorizedFunctions$', () => {
		it('should be defined', () => {
			expect(service.authorizedFunctions$).toBeDefined();
		});
	});

	describe('authorizedDataRooms$', () => {
		it('should be defined', () => {
			expect(service.authorizedDataRooms$).toBeDefined();
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
			['' as AuthFunction, [], false]
		])(
			'when neededIdentifier is %s, and current AuthFunctions are %s, should emit  %s',
			// @ts-ignore
			(neededIdentifier, currentAuthFunctions, expected, done) => {
				service.hasAuthorizationFor$(neededIdentifier).subscribe(received => {
					expect(received).toBe(expected);
					done();
				});

				// @ts-ignore
				service.authorizedFunctions.next(currentAuthFunctions);
			}
		);
	});

	describe('oauthService.claims$', () => {
		beforeEach(() => {
			authorizedFunctionsNextSpy.mockReset();
		});

		describe('authorizedFunctions', () => {
			it.each<[Claims | null, AuthFunction[]]>([
				[null, null],
				[{} as Claims, null],
				[{userroles: null} as Claims, null],
				[{userroles: []} as Claims, null],
				[{userroles: ['not', 'empty']} as Claims, authFunctionsMock]
			])('when claims is %s, should call next with %s', (claims, expected) => {
				oauthServiceClaims.next(claims);
				if (expected) {
					// @ts-ignore
					expect(authorizedFunctionsNextSpy).toHaveBeenCalledWith(expected);
				} else {
					expect(authorizedFunctionsNextSpy).not.toHaveBeenCalled();
				}
			});
		});

		describe('authorizedDataRooms', () => {
			it.each<[Claims | null, DataRoomCode[]]>([
				[null, []],
				[{} as Claims, []],
				[{userroles: null} as Claims, []],
				[{userroles: {}} as Claims, []],
				[
					{
						userroles: []
					} as Claims,
					[]
				],
				[
					{
						userroles: [
							'bag-cc-dr_bs',
							'bag-cc-dr_sh',
							'bag-cc-covid_app_manager',
							'bag-cc-vacccert_creator',
							'bag-cc-dr_sg',
							'bag-cc-dr_lu',
							'bag-cc-dr_nw',
							'bag-cc-rep_user_stats',
							'bag-cc-dr_bl',
							'bag-cc-dr_bv_intern',
							'bag-cc-dr_ju',
							'bag-cc-dr_fr',
							'bag-cc-recoverycert_antibody_creator',
							'bag-cc-rep_user_agg',
							'bag-cc-recoverycert_creator',
							'bag-cc-rep_user_detail',
							'bag-cc-dr_be',
							'bag-cc-recoverycert_rat_creator',
							'offline_access',
							'default-roles-bag-covidcertificate',
							'bag-cc-vacccert_tourist_creator',
							'bag-cc-dr_ne',
							'uma_authorization',
							'bag-cc-web_ui_revocator',
							'bag-cc-dr_vs',
							'bag-cc-dr_ar',
							'bag-cc-dr_ti',
							'bag-cc-dr_tg',
							'bag-cc-web_ui_user',
							'bag-cc-dr_sz',
							'bag-cc-dr_ai',
							'bag-cc-dr_ow',
							'bag-cc-testccert_creator',
							'bag-cc-dr_zg',
							'bag-cc-bulkcert_manager',
							'bag-cc-dr_vd',
							'bag-cc-dr_zh',
							'bag-cc-dr_armee',
							'bag-cc-dr_gr',
							'bag-cc-dr_gl',
							'bag-cc-dr_ag',
							'bag-cc-dr_ur',
							'bag-cc-api_gw_user',
							'bag-cc-dr_ge',
							'bag-cc-exceptcert_creator',
							'bag-cc-dr_so'
						]
					} as Claims,
					[
						DataRoomCode.BS,
						DataRoomCode.SH,
						DataRoomCode.SG,
						DataRoomCode.LU,
						DataRoomCode.NW,
						DataRoomCode.BL,
						DataRoomCode.BV_INTERN,
						DataRoomCode.JU,
						DataRoomCode.FR,
						DataRoomCode.BE,
						DataRoomCode.NE,
						DataRoomCode.VS,
						DataRoomCode.AR,
						DataRoomCode.TI,
						DataRoomCode.TG,
						DataRoomCode.SZ,
						DataRoomCode.AI,
						DataRoomCode.OW,
						DataRoomCode.ZG,
						DataRoomCode.VD,
						DataRoomCode.ZH,
						DataRoomCode.ARMEE,
						DataRoomCode.GR,
						DataRoomCode.GL,
						DataRoomCode.AG,
						DataRoomCode.UR,
						DataRoomCode.GE,
						DataRoomCode.SO
					]
				],
				[
					{
						userroles: [
							'bag-cc-dr_be',
							'bag-cc-recoverycert_rat_creator',
							'offline_access',
							'default-roles-bag-covidcertificate',
							'bag-cc-vacccert_tourist_creator',
							'bag-cc-dr_ne',
							'uma_authorization',
							'bag-cc-web_ui_revocator',
							'bag-cc-dr_ow',
							'bag-cc-testccert_creator',
							'bag-cc-dr_zg',
							'bag-cc-bulkcert_manager',
							'bag-cc-dr_vd',
							'bag-cc-dr_zh',
							'bag-cc-dr_armee',
							'bag-cc-dr_gr',
							'bag-cc-dr_gl',
							'bag-cc-dr_ag',
							'bag-cc-dr_ur',
							'bag-cc-api_gw_user',
							'bag-cc-dr_ge',
							'bag-cc-exceptcert_creator',
							'bag-cc-dr_so'
						]
					} as Claims,
					[
						DataRoomCode.BE,
						DataRoomCode.NE,
						DataRoomCode.OW,
						DataRoomCode.ZG,
						DataRoomCode.VD,
						DataRoomCode.ZH,
						DataRoomCode.ARMEE,
						DataRoomCode.GR,
						DataRoomCode.GL,
						DataRoomCode.AG,
						DataRoomCode.UR,
						DataRoomCode.GE,
						DataRoomCode.SO
					]
				]
			])('when claims is %s, should call next with %s', (claims, expected) => {
				oauthServiceClaims.next(claims);
				if (expected) {
					// @ts-ignore
					expect(authorizedDataRoomsNextSpy).toHaveBeenCalledWith(expected);
				} else {
					expect(authorizedDataRoomsNextSpy).not.toHaveBeenCalled();
				}
			});
		});
	});
});
