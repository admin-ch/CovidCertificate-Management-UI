import {HTTP_INTERCEPTORS, HttpEvent, HttpRequest, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {HttpConfigInterceptor} from './http.config.interceptor';
import {Observable, of} from 'rxjs';

describe('HttpConfigInterceptor', () => {
	let interceptor: HttpConfigInterceptor;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				{
					provide: HTTP_INTERCEPTORS,
					useClass: HttpConfigInterceptor,
					multi: true
				},
				HttpConfigInterceptor,
				{provide: OidcSecurityService, useValue: {getAccessToken: () => of('token')}}
			]
		}).compileComponents();
		interceptor = TestBed.inject(HttpConfigInterceptor);
		httpMock = TestBed.inject(HttpTestingController);
	});

	it('should be created', () => {
		expect(interceptor).toBeTruthy();
	});

	describe('intercept', () => {
		it('should add Authorization to Headers if pattern is matching', done => {
			const response = configTest('/v1/covidcertificate');
			response.subscribe(httpEvent => {
				expect(httpEvent.headers.get('Authorization')).toEqual('Bearer token');
				done();
			});
		});
		it('should not add Authorization to Headers if pattern is not matching', done => {
			const response = configTest('/api');
			response.subscribe(httpEvent => {
				expect(httpEvent.headers.has('Authorization')).toBe(false);
				done();
			});
		});
		it("should not add Authorization to Headers if there's no token", done => {
			const auth = TestBed.inject(OidcSecurityService);
			jest.spyOn(auth, 'getAccessToken').mockReturnValue(of(''));
			const response = configTest('/v1/covidcertificate');
			response.subscribe(httpEvent => {
				expect(httpEvent.headers.has('Authorization')).toBe(false);
				done();
			});
		});

		const configTest: (url: string) => Observable<HttpEvent<any>> = (url: string) => {
			let response: HttpResponse<any>;
			const request = new HttpRequest<any>('GET', url);
			const next: any = {
				handle: responseHandle => {
					response = responseHandle;
					return of(response);
				}
			};
			return interceptor.intercept(request, next);
		};
	});

	afterEach(() => {
		httpMock.verify();
	});
});
