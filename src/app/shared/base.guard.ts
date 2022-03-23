import {Observable} from 'rxjs';
import {take, tap} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../environments/environment';
import {AuthFunction, AuthService} from '../auth/auth.service';
import {Inject, Injectable} from '@angular/core';
import {WINDOW} from '@oblique/oblique';

@Injectable({
	providedIn: 'root'
})
export class BaseGuard {
	private readonly stage: string;

	constructor(
		private readonly translate: TranslateService,
		private readonly authService: AuthService,
		@Inject(WINDOW) private readonly window
	) {
		this.stage = environment.stage;
	}

	public checkExpectedRole(expectedAuthFunction: AuthFunction): Observable<boolean> {
		return this.authService.hasAuthorizationFor$(expectedAuthFunction).pipe(
			take(1),
			tap(isAuthorized => {
				if (!isAuthorized) {
					this.window.location.href = `https://www.eiam.admin.ch/403ggg?l=${this.translate.currentLang}&stage=${this.stage}`;
				}
			})
		);
	}
}
