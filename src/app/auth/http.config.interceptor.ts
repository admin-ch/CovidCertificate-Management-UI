import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {OpenIdConfigService} from './open-id-config-service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
	constructor(private readonly securityService: OidcSecurityService, private readonly config: OpenIdConfigService) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const token = this.securityService.getToken();
		return !this.config.urlPattern.filter(pattern => request.url.match(pattern)).length || !token
			? next.handle(request)
			: next.handle(request.clone({setHeaders: {Authorization: `Bearer ${token}`}}));
	}
}
