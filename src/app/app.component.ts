import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {ObHttpApiInterceptorEvents, ObINavigationLink, ObMasterLayoutService, ObNotificationService} from '@oblique/oblique';
import {Observable, Subject, of} from 'rxjs';
import {delay, filter, map, startWith, switchMap, takeUntil, tap} from 'rxjs/operators';
import {OauthService} from './auth/oauth.service';
import {TranslateService} from '@ngx-translate/core';
import {supportedBrowsers} from './supportedBrowsers';
import {AuthFunction, AuthService} from './auth/auth.service';
import {NotificationService} from './notifications/notification.service';

@Component({
	selector: 'ec-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
	static configs = [
		{
			functions: [AuthFunction.MAIN],
			params: {url: 'dashboard', label: 'dashboard.link'}
		},
		{
			functions: [AuthFunction.CERTIFICATE_GENERATION],
			params: {url: 'certificate-create', label: 'certificateCreate.link'}
		},
		{
			functions: [AuthFunction.CERTIFICATE_REVOCATION],
			params: {url: 'certificate-revoke', label: 'certificateRevoke.link'}
		},
		{
			functions: [AuthFunction.OTP_GENERATION],
			params: {url: 'otp', label: 'otp.link'}
		},
		{
			functions: [AuthFunction.BULK_OPERATIONS],
			params: {url: 'upload', label: 'upload.link'}
		},
		{
			functions: [AuthFunction.BULK_OPERATIONS, AuthFunction.BULK_REVOKE_CERTIFICATES],
			params: {url: 'bulk-revocation', label: 'bulk.revocation.link'}
		},
		{
			functions: [AuthFunction.REPORTING_SELF_SERVICE],
			params: {url: 'report', label: 'reports.link'}
		}
	];

	AuthFunction = AuthFunction;
	navigation: ObINavigationLink[] = [];
	isAuthenticated$: Observable<boolean>;
	name$: Observable<string>;
	currentPage: string;
	lang$: Observable<string>;
	private readonly unsubscribe = new Subject<void>();

	constructor(
		private readonly oauthService: OauthService,
		private readonly authService: AuthService,
		private readonly config: ObMasterLayoutService,
		private readonly obNotificationService: ObNotificationService,
		private readonly notificationService: NotificationService,
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

		this.isAuthenticated$.pipe(takeUntil(this.unsubscribe)).subscribe(isAuthenticated => {
			if (isAuthenticated) {
				this.notificationService.fetchNotifications();
			}
		});
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
			this.obNotificationService.info({
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
		this.authService.authorizedFunctions$.pipe(delay(0), takeUntil(this.unsubscribe)).subscribe(authFunctions => {
			const navigation: ObINavigationLink[] = [];

			const addTabIfFunctionsIncluded = cfg => {
				if (cfg.functions.every(fn => authFunctions.includes(fn))) {
					navigation.push(cfg.params);
				}
			};

			AppComponent.configs.forEach(cfg => addTabIfFunctionsIncluded(cfg));
			this.navigation = navigation;
		});
	}

	private isAuthorized(isAuthenticated: boolean): Observable<{isAuthenticated: boolean; isAuthorized: boolean}> {
		if (!isAuthenticated) {
			return of({isAuthenticated, isAuthorized: false});
		}
		return this.authService.hasAuthorizationFor$(AuthFunction.MAIN).pipe(map(isAuthorized => ({isAuthenticated, isAuthorized})));
	}
}
