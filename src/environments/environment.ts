import {OIdC} from '../app/auth/open-id-config-service';
import {LogLevel} from 'angular-auth-oidc-client';

export const environment = {
	banner: {text: 'local'},
	production: false,
	showWarning: true,
	stage: '',
	host: 'http://localhost:8120',
	notificationHost: 'http://localhost:8123',
	reportHost: 'http://localhost:8126',
	eiamSelfAdmin: 'https://eiam.chCURRENT_PAGE&language=LANGUAGE',
	oidc: {
		clientId: 'cc-management-ui',
		afterLoginPath: 'dashboard',
		authority: 'http://localhost:8180',
		applicationUrl: 'http://localhost:4201/',
		loginFeedback: 'auth/login-feedback/',
		maxIdTokenIatOffsetAllowedInSeconds: 7200,
		silentRenew: true,
		useAutoLogin: false,
		debug: LogLevel.Warn,
		tokenAwareUrlPatterns: [
			'/v1/covidcertificate.*',
			'/v1/caches.*',
			'/v1/valuesets',
			'/v1/feature-toggle/features',
			'/v1/otp',
			'/v1/revocation.*',
			'/v1/authorization/current.*',
			'/v1/notifications',
			'/v1/unit.*',
			'/v1/profile.*',
			'/v2/report.*'
		]
	} as OIdC
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
