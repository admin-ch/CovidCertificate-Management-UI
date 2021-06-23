import {OIdC} from '../app/auth/open-id-config-service';
import {LogLevel} from 'angular-auth-oidc-client';

export const environment = {
	banner: {text: ''},
	production: true,
	showWarning: true,
	stage: 'd',
	host: 'https://covidcertificate-management-d.bag.admin.ch',
	eiamSelfAdmin:
		'https://sts006-r.bag.admin.ch/_pep/myaccount?returnURL=https%3A%2F%2Fwww.covidcertificate-d.admin.chCURRENT_PAGE&language=LANGUAGE',
	oidc: {
		clientId: 'cc-management-ui',
		afterLoginPath: 'dashboard',
		stsServer: 'https://identity-r.bit.admin.ch/realms/BAG-CovidCertificate',
		applicationUrl: 'https://www.covidcertificate-d.admin.ch/',
		loginFeedback: 'auth/login-feedback/',
		maxIdTokenIatOffsetAllowedInSeconds: 60,
		silentRenew: true,
		useAutoLogin: false,
		debug: LogLevel.Warn,
		tokenAwareUrlPatterns: ['/v1/covidcertificate.*', '/v1/valuesets', '/v1/otp', '/v1/revocation']
	} as OIdC
};
