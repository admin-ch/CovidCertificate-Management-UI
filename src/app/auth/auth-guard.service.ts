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
	CERTIFICATE_CREATOR = 'bag-cc-certificatecreator'
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

		const hasAccess = this.oauthService.hasUserRole(Role.CERTIFICATE_CREATOR, claims);
		if (!hasAccess) {
			this.window.location.href = `https://www.eiam.admin.ch/403ggg?l=${this.translate.currentLang}&stage=${this.stage}`;
			return false;
		}

		if (claims.homeName === 'E-ID CH-LOGIN' && claims.unitName?.indexOf('HIN') === 0) {
			this.window.location.href = `https://www.eiam.admin.ch/chloginforbidden?l=${this.translate.currentLang}&stage=${this.stage}`;
			return false;
		}
		return hasAccess;
	}
}
