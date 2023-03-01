import {Injectable, OnDestroy} from '@angular/core';
import {ApiService} from 'shared/api.service';
import {Claims, OauthService} from './oauth.service';
import {Observable, ReplaySubject, Subscription, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {HttpParams} from '@angular/common/http';
import {DataRoomCode} from 'shared/model';

export enum AuthFunction {
	// Navigation
	MAIN = 'main',
	CERTIFICATE_GENERATION = 'main-certificate-generation',
	CERTIFICATE_REVOCATION = 'main-certificate-revocation',
	OTP_GENERATION = 'main-one-time-password-generation',
	BULK_OPERATIONS = 'main-bulk-operations',
	REPORTING_SELF_SERVICE = 'main-reporting-self-service',
	NOTIFICATION_MANAGEMENT = 'main-notification-management',

	// Create/Revoke Certificates
	CREATE_CERTIFICATE_WEB = 'create-certificate-web',
	CREATE_VACCINATION_CERTIFICATE = 'create-vaccine-certificate',
	CREATE_VACCINATION_TOURIST = 'create-vaccine-tourist-certificate',
	CREATE_TEST_CERTIFICATE = 'create-test-certificate',
	CREATE_RECOVERY_CERTIFICATE = 'create-recovery-certificate',
	CREATE_RECOVERY_RAT_CERTIFICATE = 'create-recovery-rat-certificate',
	CREATE_ANTIBODY_CERTIFICATE = 'create-antibody-certificate',
	CREATE_EXCEPTIONAL_CERTIFICATE = 'create-exceptional-certificate',
	REVOKE_CERTIFICATE = 'revoke-certificate',

	// OTP
	CREATE_OTP = 'create-otp',

	// Clear cache
	MAIN_CACHE_MANAGEMENT = 'main-cache-management',

	// Bulk
	BULK_CREATE_CERTIFICATES = 'bulk-create-certificates',
	BULK_REVOKE_CERTIFICATES = 'bulk-revoke-certificates',

	// Reports
	REPORT_A2 = 'report-a2',
	REPORT_A3 = 'report-a3',
	REPORT_A4 = 'report-a4',
	REPORT_A5 = 'report-a5',
	REPORT_A6 = 'report-a6',
	REPORT_A7 = 'report-a7',
	REPORT_A8 = 'report-a8',
	REPORT_A9 = 'report-a9',
	REPORT_A10 = 'report-a10',
	REPORT_A11 = 'report-a11',
	REPORT_A12 = 'report-a12',
	REPORT_A13 = 'report-a13'
}

@Injectable({
	providedIn: 'root'
})
export class AuthService implements OnDestroy {
	public authorizedFunctions$: Observable<AuthFunction[]>;
	public authorizedDataRooms$: Observable<DataRoomCode[]>;
	private readonly authorizedFunctions: ReplaySubject<AuthFunction[]> = new ReplaySubject<AuthFunction[]>(1);
	private readonly authorizedDataRooms: ReplaySubject<DataRoomCode[]> = new ReplaySubject<DataRoomCode[]>(1);
	private readonly claimsSubscription: Subscription;

	private readonly URL: string = 'authorization/current/web-ui';

	constructor(private readonly http: ApiService, private readonly oauthService: OauthService) {
		this.authorizedFunctions$ = this.authorizedFunctions.asObservable();
		this.authorizedDataRooms$ = this.authorizedDataRooms.asObservable();
		this.claimsSubscription = oauthService.claims$.subscribe(claims => {
			this.emitAuthorizedDataRooms(claims);
		});

		this.claimsSubscription.add(
			oauthService.claims$.pipe(switchMap(claims => this.getAuthorizedFunctions(claims))).subscribe(authorizedFunctions => {
				if (authorizedFunctions != null) {
					this.authorizedFunctions.next(authorizedFunctions);
				}
			})
		);
	}

	ngOnDestroy(): void {
		this.claimsSubscription.unsubscribe();
	}

	public hasAuthorizationFor$(...neededAuthorizedFunctions: AuthFunction[]): Observable<boolean> {
		return this.authorizedFunctions$.pipe(map(authorizedFunctions => neededAuthorizedFunctions.some(authFun => authorizedFunctions.includes(authFun))));
	}

	public hasAuthorizationForAll$(...neededAuthorizedFunctions: AuthFunction[]): Observable<boolean> {
		return this.authorizedFunctions$.pipe(map(authorizedFunctions => neededAuthorizedFunctions.every(authFun => authorizedFunctions.includes(authFun))));
	}

	private getAuthorizedFunctions(claims: Claims): Observable<AuthFunction[]> {
		if (claims?.userroles?.length) {
			const params = new HttpParams().set('roles', claims.userroles.join(','));
			return this.http.get<AuthFunction[]>(this.URL, {
				params
			});
		}
		return of(null);
	}

	private emitAuthorizedDataRooms(claims: Claims): void {
		if (claims?.userroles?.length) {
			const authorizedDataRooms: DataRoomCode[] = [];
			for (const role of claims.userroles) {
				Object.keys(DataRoomCode).forEach(code => {
					const lowerCaseCode = code.toLocaleLowerCase();
					if (role.endsWith(`bag-cc-dr_${lowerCaseCode}`)) {
						authorizedDataRooms.push(DataRoomCode[code]);
					}
				});
			}
			this.authorizedDataRooms.next(authorizedDataRooms);
		} else {
			this.authorizedDataRooms.next([]);
		}
	}
}
