import {OIdC} from '../app/auth/open-id-config-service';
import {LogLevel} from 'angular-auth-oidc-client';

export const environment = {
	banner: {text: 'ABN'},
	production: true,
	showWarning: true,
	stage: 'a',
	host: 'https://covidcertificate-management-a.bag.admin.ch',
	eiamSelfAdmin:
		'https://sts-a.pts.admin.ch/_pep/myaccount?returnURL=https%3A%2F%2Fwww.covidcertificate-a.admin.chCURRENT_PAGE&language=LANGUAGE',
	oidc: {
		clientId: 'cc-management-ui',
		afterLoginPath: 'dashboard',
		stsServer: 'https://identity-a.bit.admin.ch/realms/BAG-CovidCertificate',
		applicationUrl: 'https://www.covidcertificate-a.admin.ch/',
		loginFeedback: 'auth/login-feedback/',
		maxIdTokenIatOffsetAllowedInSeconds: 60,
		silentRenew: true,
		useAutoLogin: false,
		debug: LogLevel.Warn,
		tokenAwareUrlPatterns: ['/v1/covidcertificate.*', '/v1/valuesets', '/v1/otp', '/v1/revocation']
	} as OIdC
};
