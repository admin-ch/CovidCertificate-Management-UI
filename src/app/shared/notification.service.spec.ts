import {TestBed} from '@angular/core/testing';
import {NotificationService} from "shared/notification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as rxjs from "rxjs";
import {interval, of} from "rxjs";

describe('NotificationService', () => {
	let service: NotificationService;

	const responseHeaders = new HttpHeaders()

	const mockResponse = {
		status: 200,
		headers: responseHeaders.append('ETag', 'ETag')
	}
	const getMock = jest.fn().mockReturnValue(of(mockResponse))
	const setItemSpy = jest.spyOn(window.localStorage, 'setItem')
	const getItemSpy = jest.spyOn(window.localStorage, 'getItem')
	const timerMock = jest.spyOn(rxjs, 'timer').mockReturnValue(of(1))

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{provide: 'NOTIFICATION_HOST', useValue: 'NOTIFICATION_HOST'},
				{
					provide: HttpClient, useValue: {
						get: getMock
					}
				}
			]
		});
		service = TestBed.inject(NotificationService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('fetchNotifications', () => {

		beforeEach(() => {
			getMock.mockClear()
			getItemSpy.mockClear()
			setItemSpy.mockClear()

		})

		it('should call pull every 15 minutes', () => {
			service.fetchNotifications()

			expect(timerMock).toHaveBeenCalledWith(0, 1000 * 60 * 15)

		});

		it('should call get without If-None-Match header', () => {
			getItemSpy.mockReturnValue(null)

			service.fetchNotifications()


			expect(getMock).toHaveBeenCalledWith(`NOTIFICATION_HOST/api/v1/notifications/`, {
				headers: {},
				observe: 'response'
			})

		});

		it('should call get with If-None-Match header', () => {
			getItemSpy.mockReturnValue('ETag')

			service.fetchNotifications()
			expect(getMock).toHaveBeenCalledWith(`NOTIFICATION_HOST/api/v1/notifications/`, {
				headers: {'If-None-Match': 'ETag'},
				observe: 'response'
			})

		});

		it('should set localStorage item from ETag header if status is not 304', () => {
			mockResponse.status = 200
			getMock.mockReturnValue(of(mockResponse))
			getItemSpy.mockReturnValue('ETag')

			service.fetchNotifications()

			expect(setItemSpy).toHaveBeenCalledWith('ecNotificationETag', 'ETag')
		});

		it('should not set localStorage item from ETag header if status is 304', () => {
			mockResponse.status = 304
			getMock.mockReturnValue(of(mockResponse))
			getItemSpy.mockReturnValue('ETag')

			service.fetchNotifications()

			expect(setItemSpy).not.toHaveBeenCalled()
		});

		it('should unsubscribe when service is destroyed', () => {
			// @ts-ignore
			service.subscription = interval(1000).subscribe()
			// @ts-ignore
			const unsubSpy = jest.spyOn(service.subscription, 'unsubscribe')

			service.ngOnDestroy()
			expect(unsubSpy).toHaveBeenCalled()
		});
	});
});
