import {Inject, Injectable} from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	CanLoad,
	Route,
	RouterStateSnapshot,
	UrlSegment
} from '@angular/router';
import {Observable} from 'rxjs';
import {take, tap} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {WINDOW} from '@oblique/oblique';
import {environment} from '../../environments/environment';
import {AuthFunction, AuthService} from '../auth/auth.service';

@Injectable({
	providedIn: 'root'
})
export class CertificateRevokeGuard implements CanActivate, CanActivateChild, CanLoad {
	private readonly stage: string;

	constructor(
		private readonly translate: TranslateService,
		private readonly authService: AuthService,
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

	canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
		return this.checkExpectedRole();
	}

	private checkExpectedRole(): Observable<boolean> {
		return this.authService.hasAuthorizationFor$(AuthFunction.REVOKE_CERTIFICATE).pipe(
			take(1),
			tap(isAuthorized => {
				if (!isAuthorized) {
					this.window.location.href = `https://www.eiam.admin.ch/403ggg?l=${this.translate.currentLang}&stage=${this.stage}`;
				}
			})
		);
	}
}
