import {Injectable} from '@angular/core';
import {LogLevel} from 'angular-auth-oidc-client';
import {environment} from '../../environments/environment';

export interface OIdC {
	clientId: string;
	authority: string;
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
	get authorityUrl(): string {
		return environment.oidc.authority;
	}

	get autoLogin(): boolean {
		return environment.oidc.useAutoLogin;
	}

	get urlPattern(): string[] {
		return environment.oidc.tokenAwareUrlPatterns;
	}
}
