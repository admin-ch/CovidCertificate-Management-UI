import {Inject, Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, CanLoad, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {switchMap, take, tap} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {WINDOW} from '@oblique/oblique';
import {environment} from '../../environments/environment';
import {AuthFunction, AuthService} from './auth.service';
import {OauthService} from './oauth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad {
	private readonly stage: string;

	constructor(
		private readonly oauthService: OauthService,
		private readonly router: Router,
		private readonly translate: TranslateService,
		private readonly authService: AuthService,
		@Inject(WINDOW) private readonly window
	) {
		this.stage = environment.stage;
	}

	canActivate(): Observable<boolean> {
		return this.checkExpectedRole();
	}

	canActivateChild(): Observable<boolean> {
		return this.checkExpectedRole();
	}

	canLoad(): Observable<boolean> {
		return this.checkExpectedRole();
	}

	private checkExpectedRole(): Observable<boolean> {
		return this.oauthService.isAuthenticated$.pipe(
			switchMap(isAuthenticated => {
				if (!isAuthenticated) {
					this.router.navigate(['auth/auto-login']);
					return of(false);
				}
				return this.authService.hasAuthorizationFor$(AuthFunction.MAIN).pipe(
					take(1),
					tap(isAuthorized => {
						if (!isAuthorized) {
							this.window.location.href = `https://www.eiam.admin.ch/403ggg?l=${this.translate.currentLang}&stage=${this.stage}`;
						}
					})
				);
			})
		);
	}
}
