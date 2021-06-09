import {TestBed} from '@angular/core/testing';
import {HttpResponsesInterceptor} from './http-responses.interceptor';
import {ObliqueTestingModule, ObNotificationService} from '@oblique/oblique';
import {HttpErrorResponse, HttpRequest} from '@angular/common/http';
import {throwError} from 'rxjs';

describe('HttpResponsesInterceptor', () => {
	const mockGeneralErrorHttpHandler = {handle: jest.fn()};
	const mockHttpRequest = new HttpRequest('GET', 'url');
	const mockNotificationService = {error: jest.fn()};

	let interceptor: HttpResponsesInterceptor;

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ObliqueTestingModule],
			providers: [HttpResponsesInterceptor, {provide: ObNotificationService, useValue: mockNotificationService}]
		})
	);

	beforeEach(() => {
		interceptor = TestBed.inject(HttpResponsesInterceptor);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be created', () => {
		expect(interceptor).toBeTruthy();
	});

	describe('Non handled error code', () => {
		beforeEach(() => {
			const error: HttpErrorResponse = new HttpErrorResponse({error: {errorCode: 42}, status: 500});
			mockGeneralErrorHttpHandler.handle.mockReturnValueOnce(throwError(error));
		});

		it('should rethrow the error', done => {
			interceptor.intercept(mockHttpRequest, mockGeneralErrorHttpHandler).subscribe(
				() => {},
				error => {
					expect(error.error).toEqual({errorCode: 42});
					done();
				}
			);
		});

		it('should call the ObNotificationService', done => {
			interceptor.intercept(mockHttpRequest, mockGeneralErrorHttpHandler).subscribe(
				() => {},
				() => {
					expect(mockNotificationService.error).toHaveBeenCalledTimes(1);
					done();
				}
			);
		});

		it('should call the ObNotificationService with the correct param', done => {
			interceptor.intercept(mockHttpRequest, mockGeneralErrorHttpHandler).subscribe(
				() => {},
				() => {
					expect(mockNotificationService.error).toHaveBeenCalledWith('i18n.oblique.http.error.status.500');
					done();
				}
			);
		});
	});

	describe('Handle error code 470', () => {
		beforeEach(() => {
			const error: HttpErrorResponse = new HttpErrorResponse({error: {errorCode: 470}, status: 500});
			mockGeneralErrorHttpHandler.handle.mockReturnValueOnce(throwError(error));
		});

		it('should call the ObNotificationService', done => {
			interceptor.intercept(mockHttpRequest, mockGeneralErrorHttpHandler).subscribe(
				() => {},
				() => {
					expect(mockNotificationService.error).toHaveBeenCalledTimes(1);
					done();
				}
			);
		});

		it('should call the ObNotificationService with the correct param', done => {
			interceptor.intercept(mockHttpRequest, mockGeneralErrorHttpHandler).subscribe(
				() => {},
				() => {
					expect(mockNotificationService.error).toHaveBeenCalledWith('validation.error.http.470');
					done();
				}
			);
		});
	});

	describe('Handle error code 480', () => {
		beforeEach(() => {
			mockGeneralErrorHttpHandler.handle.mockReturnValueOnce(throwError({error: {errorCode: 480}}));
		});

		it('should call the ObNotificationService', done => {
			interceptor.intercept(mockHttpRequest, mockGeneralErrorHttpHandler).subscribe(
				() => {},
				() => {
					expect(mockNotificationService.error).toHaveBeenCalledTimes(1);
					done();
				}
			);
		});

		it('should call the ObNotificationService with the correct param', done => {
			interceptor.intercept(mockHttpRequest, mockGeneralErrorHttpHandler).subscribe(
				() => {},
				() => {
					expect(mockNotificationService.error).toHaveBeenCalledWith('validation.error.http.480');
					done();
				}
			);
		});
	});

	describe('Handle status 401', () => {
		beforeEach(() => {
			const error: HttpErrorResponse = new HttpErrorResponse({error: {status: 401}});
			mockGeneralErrorHttpHandler.handle.mockReturnValueOnce(throwError(error));
		});

		it('should call the ObNotificationService', done => {
			interceptor.intercept(mockHttpRequest, mockGeneralErrorHttpHandler).subscribe(
				() => {},
				() => {
					expect(mockNotificationService.error).toHaveBeenCalledTimes(1);
					done();
				}
			);
		});

		it('should call the ObNotificationService with the correct param', done => {
			interceptor.intercept(mockHttpRequest, mockGeneralErrorHttpHandler).subscribe(
				() => {},
				() => {
					expect(mockNotificationService.error).toHaveBeenCalledWith('i18n.oblique.http.error.status.0');
					done();
				}
			);
		});
	});
});
