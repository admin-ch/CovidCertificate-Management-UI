import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {ObHttpApiInterceptorEvents, ObINavigationLink, ObMasterLayoutService} from '@oblique/oblique';
import {Observable, of, Subject} from 'rxjs';
import {delay, filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {OauthService} from './auth/oauth.service';
import {Role} from './auth/auth-guard.service';

@Component({
	selector: 'ec-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
	navigation: ObINavigationLink[] = [
		{url: 'dashboard', label: 'dashboard.link'},
		{url: 'certificate-create', label: 'certificateCreate.link'},
		{url: 'certificate-revoke', label: 'certificateRevoke.link'},
		{url: 'otp', label: 'otp.link'},
		{url: 'upload', label: 'upload.link'}
	];
	isAuthenticated$: Observable<boolean>;
	name$: Observable<string>;
	currentPage: string;
	private readonly unsubscribe = new Subject();

	constructor(
		private readonly oauthService: OauthService,
		interceptor: ObHttpApiInterceptorEvents,
		router: Router,
		private readonly config: ObMasterLayoutService
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
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	ngAfterViewInit(): void {
		this.oauthService.initialize();
		this.oauthService.loadClaims();
	}

	logout(): void {
		this.oauthService.logout();
	}

	private isAuthorized(isAuthenticated: boolean): Observable<{isAuthenticated: boolean; isAuthorized: boolean}> {
		if (!isAuthenticated) {
			return of({isAuthenticated, isAuthorized: false});
		}
		return this.oauthService.claims$.pipe(
			map(claims => this.oauthService.hasUserRole(Role.CERTIFICATE_CREATOR, claims)),
			map(isAuthorized => ({isAuthenticated, isAuthorized}))
		);
	}
}
