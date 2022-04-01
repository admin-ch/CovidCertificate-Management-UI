import {OIdC} from '../app/auth/open-id-config-service';
import {LogLevel} from 'angular-auth-oidc-client';

export const environment = {
	banner: {text: ''},
	production: true,
	showWarning: true,
	stage: 'p',
	host: 'https://covidcertificate-management.bag.admin.ch',
	eiamSelfAdmin:
		'https://sts.pts.admin.ch/_pep/myaccount?returnURL=https%3A%2F%2Fwww.covidcertificate.admin.chCURRENT_PAGE&language=LANGUAGE',
	oidc: {
		clientId: 'cc-management-ui',
		afterLoginPath: 'dashboard',
		stsServer: 'https://identity.bit.admin.ch/realms/BAG-CovidCertificate',
		applicationUrl: 'https://www.covidcertificate.admin.ch/',
		loginFeedback: 'auth/login-feedback/',
		maxIdTokenIatOffsetAllowedInSeconds: 7200,
		silentRenew: true,
		useAutoLogin: false,
		debug: LogLevel.Warn,
		tokenAwareUrlPatterns: [
			'/v1/covidcertificate.*',
			'/v1/valuesets',
			'/v1/feature-toggle/features',
			'/v1/otp',
			'/v1/revocation',
			'/v1/authorization/current.*'
		]
	} as OIdC
};
