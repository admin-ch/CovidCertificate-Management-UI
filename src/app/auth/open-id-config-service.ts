import {Injectable} from '@angular/core';
import {LogLevel, OpenIdConfiguration} from 'angular-auth-oidc-client';
import {environment} from '../../environments/environment';

export interface OIdC {
	clientId: string;
	stsServer: string;
	applicationUrl: string;
	loginFeedback: string;
	afterLoginPath: string;
	maxIdTokenIatOffsetAllowedInSeconds: number;
	silentRenew: boolean;
	useAutoLogin: boolean;
	debug: LogLevel;
	tokenAwareUrlPatterns: string[];
}

@Injectable({
	providedIn: 'root'
})
export class OpenIdConfigService {
	readonly config: OpenIdConfiguration = {
		clientId: environment.oidc.clientId,
		stsServer: environment.oidc.stsServer,
		redirectUrl: `${environment.oidc.applicationUrl}${environment.oidc.loginFeedback}`,
		silentRenewUrl: `${environment.oidc.applicationUrl}assets/auth/silent-refresh.html`,
		postLogoutRedirectUri: environment.oidc.applicationUrl,
		postLoginRoute: `/${environment.oidc.afterLoginPath}`,
		logLevel: environment.oidc.debug,
		maxIdTokenIatOffsetAllowedInSeconds: environment.oidc.maxIdTokenIatOffsetAllowedInSeconds,
		responseType: 'code',
		startCheckSession: false,
		silentRenew: environment.oidc.silentRenew,
		autoUserinfo: true
	};

	get stsStagingUrl(): string {
		return environment.oidc.stsServer;
	}

	get autoLogin(): boolean {
		return environment.oidc.useAutoLogin;
	}

	get urlPattern(): string[] {
		return environment.oidc.tokenAwareUrlPatterns;
	}
}
