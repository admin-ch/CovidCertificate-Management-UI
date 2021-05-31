import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {OpenIdConfigService} from './open-id-config-service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
	constructor(private readonly securityService: OidcSecurityService, private readonly config: OpenIdConfigService) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const token = this.securityService.getToken();
		return !this.config.urlPattern.filter(pattern => request.url.match(pattern)).length || !token
			? next.handle(request)
			: next.handle(request.clone({setHeaders: {Authorization: `Bearer ${token}`}}));
	}
}
