import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ObHttpApiInterceptorEvents, ObNotificationService} from '@oblique/oblique';
import {ObIObliqueHttpErrorResponse} from '@oblique/oblique/lib/http-api-interceptor/http-api-interceptor.model';

@Injectable()
export class HttpResponsesInterceptor implements HttpInterceptor {
	private readonly supportedErrorCodes: number[] = [453, 470, 480, 482, 485, 489];

	constructor(
		private readonly notificationService: ObNotificationService,
		private readonly interceptorEvents: ObHttpApiInterceptorEvents
	) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			catchError(error => throwError({error, handled: false})),
			catchError(error => this.handleUnknownError(error)),
			catchError(error => this.handleSessionExpiredError(error)),
			catchError(error => this.handleHttpError(error)),
			catchError(error => throwError(error.error))
		);
	}

	private handleUnknownError(error: ObIObliqueHttpErrorResponse): Observable<never> {
		return this.handleError(error, !(error.error instanceof HttpErrorResponse), () =>
			this.notificationService.error('i18n.oblique.http.error.general')
		);
	}

	private handleSessionExpiredError(error: ObIObliqueHttpErrorResponse): Observable<never> {
		return this.handleError(error, error.error.status === 401, () => this.interceptorEvents.sessionExpire());
	}

	private handleHttpError(error: ObIObliqueHttpErrorResponse): Observable<never> {
		return this.handleError(error, true, () => this.notify(error.error));
	}

	private handleError(error: ObIObliqueHttpErrorResponse, hasError: boolean, action: () => void) {
		if (!error.handled && hasError) {
			if (this.isErrorHandled(error.error)) {
				this.notificationService.error(`validation.error.http.${error?.error?.error?.errorCode}`);
			} else {
				action();
			}
			error.handled = true;
		}
		return throwError(error);
	}

	private isErrorHandled(error: HttpErrorResponse): boolean {
		return this.supportedErrorCodes.indexOf(error?.error?.errorCode) > -1;
	}

	private notify(error: HttpErrorResponse): void {
		this.notificationService.error(`i18n.oblique.http.error.status.${error.status}`);
	}
}
