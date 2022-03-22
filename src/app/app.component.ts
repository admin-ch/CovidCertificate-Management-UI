import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {
	ObHttpApiInterceptorEvents,
	ObINavigationLink,
	ObMasterLayoutService,
	ObNotificationService
} from '@oblique/oblique';
import {Observable, of, Subject} from 'rxjs';
import {delay, filter, map, startWith, switchMap, takeUntil, tap} from 'rxjs/operators';
import {OauthService} from './auth/oauth.service';
import {TranslateService} from '@ngx-translate/core';
import {supportedBrowsers} from './supportedBrowsers';
import {AuthFunction, AuthService} from "./auth/auth.service";

@Component({
	selector: 'ec-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
	navigation: ObINavigationLink[] = [];
	isAuthenticated$: Observable<boolean>;
	name$: Observable<string>;
	currentPage: string;
	lang$: Observable<string>;
	private readonly unsubscribe = new Subject();

	constructor(
		private readonly oauthService: OauthService,
		private readonly authService: AuthService,
		private readonly config: ObMasterLayoutService,
		private readonly notificationService: ObNotificationService,
		interceptor: ObHttpApiInterceptorEvents,
		router: Router,
		translate: TranslateService
	) {
		this.name$ = this.oauthService.name$;
		this.isAuthenticated$ = this.oauthService.isAuthenticated$.pipe(
			delay(0),
			switchMap(isAuthenticated => this.isAuthorized(isAuthenticated)),
			tap(status => (this.config.layout.hasMainNavigation = status.isAuthorized)),
			map(status => status.isAuthenticated)
		);
		// no observable because of IE
		router.events
			.pipe(
				filter(evt => evt instanceof NavigationEnd),
				map((evt: NavigationEnd) => evt.url),
				takeUntil(this.unsubscribe)
			)
			.subscribe(url => (this.currentPage = url));

		interceptor.sessionExpired.subscribe(() => this.logout());
		this.lang$ = translate.onLangChange.pipe(
			map(lang => lang.lang),
			startWith(translate.currentLang)
		);
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	ngAfterViewInit(): void {
		this.oauthService.initialize();
		this.oauthService.loadClaims();
		this.setNavigation();
		if (!supportedBrowsers.test(navigator.userAgent)) {
			this.notificationService.info({
				title: 'notifications.unsupportedBrowser.title',
				message: 'notifications.unsupportedBrowser.message',
				sticky: true
			});
		}
	}

	logout(): void {
		this.oauthService.logout();
	}

	private setNavigation(): void {
		this.authService.authorizedFunctions$.pipe(
			delay(0),
			takeUntil(this.unsubscribe))
			.subscribe(authFunctions => {
				const navigation: ObINavigationLink[] = []
				if (authFunctions.includes(AuthFunction.MAIN)) {
					navigation.push({url: 'dashboard', label: 'dashboard.link'})
				}
				if (authFunctions.includes(AuthFunction.CERTIFICATE_GENERATION)) {
					navigation.push({url: 'certificate-create', label: 'certificateCreate.link'})
				}
				if (authFunctions.includes(AuthFunction.CERTIFICATE_REVOCATION)) {
					navigation.push({url: 'certificate-revoke', label: 'certificateRevoke.link'},)
				}
				if (authFunctions.includes(AuthFunction.OTP_GENERATION)) {
					navigation.push({url: 'otp', label: 'otp.link'})
				}
				if (authFunctions.includes(AuthFunction.BULK_OPERATIONS)) {
					navigation.push({url: 'upload', label: 'upload.link'})
				}
				this.navigation = navigation
			})
	}

	private isAuthorized(isAuthenticated: boolean): Observable<{ isAuthenticated: boolean; isAuthorized: boolean }> {
		if (!isAuthenticated) {
			return of({isAuthenticated, isAuthorized: false});
		}
		return this.authService.hasAuthorizationFor$(AuthFunction.MAIN).pipe(
			map(isAuthorized => ({isAuthenticated, isAuthorized}))
		);
	}
}
