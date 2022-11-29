import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, firstValueFrom, from, lastValueFrom} from 'rxjs';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {OpenIdConfigService} from './open-id-config-service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
	constructor(private readonly securityService: OidcSecurityService, private readonly config: OpenIdConfigService) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return from(this.handle(request, next));
	}

	async handle(request: HttpRequest<unknown>, next: HttpHandler) {
		const token = await firstValueFrom(this.securityService.getAccessToken());

		const httpEvent$ =
			!this.config.urlPattern.filter(pattern => request.url.match(pattern)).length || !token
				? next.handle(request)
				: next.handle(request.clone({setHeaders: {Authorization: `Bearer ${token}`}}));
		return await lastValueFrom(httpEvent$);
	}
}
