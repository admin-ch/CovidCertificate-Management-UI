import {Inject, Injectable} from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	CanLoad,
	Route,
	Router,
	RouterStateSnapshot
} from '@angular/router';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {WINDOW} from '@oblique/oblique';
import {Claims, OauthService} from './oauth.service';
import {environment} from '../../environments/environment';

export enum Role {
	CERTIFICATE_CREATOR = 'bag-cc-certificatecreator',
	SUPER_USER = 'bag-cc-superuser',
	HIN = 'bag-cc-hin',
	HINCODE = 'bag-cc-hincode',
	HIN_EPR = 'bag-cc-hin-epr',
	PERSONAL = 'bag-cc-personal'
}

@Injectable({
	providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad {
	private readonly stage: string;

	constructor(
		private readonly oauthService: OauthService,
		private readonly router: Router,
		private readonly translate: TranslateService,
		@Inject(WINDOW) private readonly window
	) {
		this.stage = environment.stage;
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.checkExpectedRole();
	}

	canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.checkExpectedRole();
	}

	canLoad(route: Route): Observable<boolean> {
		return this.checkExpectedRole();
	}

	private checkExpectedRole(): Observable<boolean> {
		return this.oauthService.claims$.pipe(
			take(1),
			map(claims => this.checkExpectedRoleAfterAuthentication(claims))
		);
	}

	private checkExpectedRoleAfterAuthentication(claims: Claims): boolean {
		if (!claims) {
			this.router.navigate(['auth/auto-login']);
			return false;
		}

		if (this.oauthService.hasUserRole(Role.SUPER_USER, claims)) {
			return true;
		} else {
			return this.checkExpectedRolesForStandardUser(claims);
		}
	}

	private checkExpectedRolesForStandardUser(claims: Claims): boolean {
		const hasAccess = this.oauthService.hasUserRole(Role.CERTIFICATE_CREATOR, claims);
		if (!hasAccess) {
			this.window.location.href = `https://www.eiam.admin.ch/403ggg?l=${this.translate.currentLang}&stage=${this.stage}`;
			return false;
		}

		if (
			this.isHinUser(claims) &&
			(!this.oauthService.hasUserRole(Role.HINCODE, claims) ||
				!this.oauthService.hasUserRole(Role.PERSONAL, claims))
		) {
			this.window.location.href = `https://www.eiam.admin.ch/403ggg?l=${this.translate.currentLang}&stage=${this.stage}`;
			return false;
		}
		return hasAccess;
	}

	private isHinUser(claims: Claims): boolean {
		return this.oauthService.hasUserRole(Role.HIN_EPR, claims) || this.oauthService.hasUserRole(Role.HIN, claims);
	}
}
