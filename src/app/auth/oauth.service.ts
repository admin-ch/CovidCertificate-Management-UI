import {Injectable} from '@angular/core';
import {AbstractLoggerService, OidcSecurityService} from 'angular-auth-oidc-client';
import {Observable, ReplaySubject} from 'rxjs';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {OpenIdConfigService} from './open-id-config-service';

export interface Claims {
	acr: string;
	aud: string;
	auth_time: number;
	azp: string;
	email_verified: boolean;
	exp: number;
	displayName?: string;
	name?: string;
	iat: number;
	iss: string;
	jti: string;
	nbf: number;
	nonce: string;
	preferred_username: string;
	session_state: string;
	sub: string;
	typ: string;
	allowedOrigins: string[];
	realm_access: {
		roles: string[];
	};
	userroles: string[];
	resourceAccess: {
		account: {
			roles: string[];
		};
	};
	scope: string;
	ctx: string;
	homeName?: string;
	unitName?: string;
}

@Injectable({
	providedIn: 'root'
})
export class OauthService {
	readonly name$: Observable<string>;
	readonly claims$: Observable<Claims>;
	readonly isAuthenticated$: Observable<boolean>;
	private readonly isAuthenticated = new ReplaySubject<boolean>(1);
	private readonly claims = new ReplaySubject<Claims>(1);

	protected constructor(
		private readonly oidcSecurityService: OidcSecurityService,
		private readonly config: OpenIdConfigService,
		private readonly logger: AbstractLoggerService
	) {
		this.claims$ = this.claims.asObservable();
		this.isAuthenticated$ = this.isAuthenticated.asObservable();
		this.name$ = this.claims$.pipe(
			filter(claims => !!claims),
			map(claims => claims.displayName || claims.name)
		);
	}

	logout(): void {
		this.oidcSecurityService.logoff();
	}

	login(): void {
		this.oidcSecurityService.authorize();
	}

	initialize(): void {
		this.oidcSecurityService.checkAuth(window.location.toString()).subscribe();
	}

	loadClaims(): void {
		// In case of each login event your authentication status has to be checked
		this.oidcSecurityService.isAuthenticated$
			.pipe(
				// take(1),
				tap(loginResponse => this.autoLogin(loginResponse.isAuthenticated)),
				tap(loginResponse => this.emitIsAuthorized(loginResponse.isAuthenticated)),
				filter(loginResponse => loginResponse.isAuthenticated || !this.config.autoLogin),
				switchMap(loginResponse => this.getClaims(loginResponse.isAuthenticated))
			)
			.subscribe(claims => {
				this.logger.logDebug(`Claims are ${claims}`);
				this.claims.next(claims);
			});
	}

	hasUserRole(role: string, claims: unknown): boolean {
		return OauthService.isClaims(claims) && claims.userroles?.includes(role);
	}

	private static isClaims(claims: unknown | {userroles: string[]}): claims is {userroles: string[]} {
		return !!(claims as {userroles: string[]})?.userroles;
	}

	private autoLogin(isAuthorized: boolean): void {
		if (!isAuthorized && this.config.autoLogin) {
			this.logger.logDebug('You are not logged in but this site requires login: AutoLogin');
			this.oidcSecurityService.authorize();
		}
	}

	private emitIsAuthorized(isAuthorized: boolean): void {
		this.logger.logDebug(`Authentication Status is: ${isAuthorized}`);
		this.isAuthenticated.next(isAuthorized);
	}

	private getClaims(isAuthorized: boolean): Observable<Claims> {
		return this.oidcSecurityService.userData$.pipe(
			map(userDataResult => {
				return this.validateClaims(isAuthorized, userDataResult.userData);
			})
		);
	}

	private validateClaims(isAuthorized: boolean, claims: Claims): Claims {
		if (isAuthorized && !claims) {
			this.logger.logDebug('No claims but authorized: empty claims');
			return {} as Claims;
		}
		if (!isAuthorized && claims) {
			this.logger.logDebug('Claims but unauthorized: no claims');
			return undefined;
		}
		return claims;
	}
}
