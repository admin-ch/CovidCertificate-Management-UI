import {OIdC} from '../app/auth/open-id-config-service';
import {LogLevel} from 'angular-auth-oidc-client';

export const environment = {
	banner: {text: ''},
	production: true,
	showWarning: true,
	stage: 'p',
	host: 'https://covidcertificate-management.bag.admin.ch',
	notificationHost: 'https://covidcertificate-notification.bag.admin.ch',
	reportHost: 'https://covidcertificate-report.bag.admin.ch',
	eiamSelfAdmin: 'https://sts006.bag.admin.ch/_pep/myaccount?returnURL=https%3A%2F%2Fwww.covidcertificate.admin.chCURRENT_PAGE&language=LANGUAGE',
	oidc: {
		clientId: 'cc-management-ui',
		afterLoginPath: 'dashboard',
		authority: 'https://identity.bit.admin.ch/realms/BAG-CovidCertificate',
		applicationUrl: 'https://www.covidcertificate.admin.ch/',
		loginFeedback: 'auth/login-feedback/',
		maxIdTokenIatOffsetAllowedInSeconds: 7200,
		silentRenew: true,
		useAutoLogin: false,
		debug: LogLevel.Warn,
		tokenAwareUrlPatterns: [
			'/v1/covidcertificate.*',
			'/v1/cache.*',
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
