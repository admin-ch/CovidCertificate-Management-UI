import {fakeAsync, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {NotificationService} from './notification.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as rxjs from 'rxjs';
import {interval, of} from 'rxjs';
import * as moment from 'moment';

describe('NotificationService', () => {
	let service: NotificationService;

	const responseHeaders = new HttpHeaders();

	const mockResponse = {
		status: 200,
		headers: responseHeaders.append('ETag', 'ETag'),
		body: []
	};
	const getMock = jest.fn().mockReturnValue(of(mockResponse));
	const timerMock = jest.spyOn(rxjs, 'timer').mockReturnValue(of(1));

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{provide: 'NOTIFICATION_HOST', useValue: 'NOTIFICATION_HOST'},
				{
					provide: 'IS_PRODUCTION',
					useValue: true

				},
				{
					provide: HttpClient,
					useValue: {
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

	describe('imminentNotifications$', () => {
		it('should be initialized', () => {
			expect(service.imminentNotifications$).toBeTruthy();
		});
	});

	describe('upcomingNotifications$', () => {
		it('should be initialized', () => {
			expect(service.upcomingNotifications$).toBeTruthy();
		});

		it.each([null, 'null', undefined, 'undefined', 1, '1', false, 'false'])(
			'should emit if localStorage key for already shown is %p',
			waitForAsync(localStorageValue => {
				localStorage.getItem = jest.fn(() => localStorageValue);
				const expectedValue = [1, 2, 3];
				service.upcomingNotifications$.subscribe(value => {
					expect(value).toEqual(expectedValue);
				});
				// @ts-ignore
				service.upcomingNotifications.next(expectedValue);
			})
		);
	});

	describe('fetchNotifications', () => {
		beforeEach(() => {
			getMock.mockClear();
			timerMock.mockClear()
		});

		it('should not pull if it is not in production', () => {
			// @ts-ignore
			service.isProduction = false
			service.fetchNotifications();
			expect(timerMock).not.toHaveBeenCalled()
		});

		it('should call pull every 15 minutes', () => {
			service.fetchNotifications();

			expect(timerMock).toHaveBeenCalledWith(0, 1000 * 60 * 15);
		});

		it('should call get without If-None-Match header', () => {
			localStorage.getItem = jest.fn(() => null);

			service.fetchNotifications();

			expect(getMock).toHaveBeenCalledWith(`NOTIFICATION_HOST/api/v1/notifications/`, {
				headers: {},
				observe: 'response'
			});
		});

		it('should call get with If-None-Match header', () => {
			localStorage.getItem = jest.fn(() => 'ETag');

			service.fetchNotifications();
			expect(getMock).toHaveBeenCalledWith(`NOTIFICATION_HOST/api/v1/notifications/`, {
				headers: {'If-None-Match': 'ETag'},
				observe: 'response'
			});
		});

		it.each([
			[[], [{value: 1}], [true]],
			[[], [{value: 1}, {value: 2}], [true, true]],
			[[{value: 2}], [{value: 1}, {value: 2}], [true, false]],
			[[{value: 2}], [{value: 1}, {value: 2}, {value: 3}], [true, false, true]],
			[
				[{value: 1}, {value: 2}, {value: 3}],
				[{value: 1}, {value: 2}, {value: 3}],
				[false, false, false]
			],
			[
				[{value: 1}, {value: 2}, {value: 3}],
				[{value: 1}, {value: 2}, {value: 3}],
				[false, false, false]
			]
		])(
			'should emit %o if saved notifications are %o and shown-map is %o',
			waitForAsync((expected, notifications, shownMap) => {
				JSON.parse = jest.fn().mockReturnValueOnce(notifications).mockReturnValueOnce(shownMap);

				service.fetchNotifications();

				service.upcomingNotifications$.subscribe(value => {
					expect(value).toEqual(expected);
				});
			})
		);

		describe('if response status is 304', () => {
			beforeEach(() => {
				mockResponse.status = 304;
				getMock.mockReturnValue(of(mockResponse));
				localStorage.setItem = jest.fn();
			});

			it('should not set localStorage item from ETag header', () => {
				localStorage.getItem = jest.fn(() => 'ETag');

				service.fetchNotifications();

				expect(localStorage.setItem).not.toHaveBeenCalled();
			});

			it('should not set shown-map for already shown to %o if responseBody is %o', () => {
				mockResponse.body = [{value: 1}, {value: 2}, {value: 3}];
				getMock.mockReturnValue(of(mockResponse));
				localStorage.setItem = jest.fn();

				service.fetchNotifications();

				expect(localStorage.setItem).not.toHaveBeenCalled();
			});

			const oneDayAgoMoment = moment();
			const oneHourAgoMoment = moment();
			const inOneDayMoment = moment();
			const inOneHourMoment = moment();
			oneDayAgoMoment.subtract(1, 'days');
			oneHourAgoMoment.subtract(1, 'hours');
			inOneDayMoment.add(1, 'days');
			inOneHourMoment.add(1, 'hours');

			const oneDayAgo = oneDayAgoMoment.toISOString();
			const oneHourAgo = oneHourAgoMoment.toISOString();
			const inOneDay = inOneDayMoment.toISOString();
			const inOneHour = inOneHourMoment.toISOString();

			it.each([
				[1, [{start: oneHourAgo, end: inOneHour, shouldShow: true}]],
				[
					2,
					[
						{start: oneHourAgo, end: inOneHour, shouldShow: true},
						{start: oneDayAgo, end: inOneHour, shouldShow: true}
					]
				],
				[
					2,
					[
						{start: oneHourAgo, end: inOneHour, shouldShow: true},
						{start: oneDayAgo, end: inOneHour, shouldShow: true},
						{start: inOneHour, end: inOneDay, shouldShow: false},
						{start: inOneHour, end: inOneDay, shouldShow: false}
					]
				]
			])(
				'should emit %s notifications for %o}',
				fakeAsync(
					(
						expectedNotificationLength: number,
						notifications: { start: string; end: string; shouldShow: boolean }[]
					) => {
						JSON.parse = jest.fn(() => notifications);
						service.fetchNotifications();

						service.imminentNotifications$.subscribe(notificationsUnderTest => {
							expect(notificationsUnderTest.length).toBe(expectedNotificationLength);
							// @ts-ignore
							expect(notificationsUnderTest.every(n => n.shouldShow === true)).toBe(true);
						});

						tick();
					}
				)
			);
		});

		describe('if response status is not 304', () => {
			beforeEach(() => {
				mockResponse.status = 200;
				getMock.mockReturnValue(of(mockResponse));
				localStorage.setItem = jest.fn();
			});

			it.each([
				[[], []],
				[
					[false, false, false],
					[{value: 1}, {value: 2}, {value: 3}]
				]
			])('should set shown-map for already shown to %o if responseBody is %o', (expected, responseBody) => {
				mockResponse.body = responseBody;
				getMock.mockReturnValue(of(mockResponse));
				localStorage.setItem = jest.fn();

				service.fetchNotifications();

				expect(localStorage.setItem).toHaveBeenLastCalledWith(
					'ecUpcomingNotificationsShown',
					JSON.stringify(expected)
				);
			});

			it('should set localStorage item from ETag header', () => {
				localStorage.getItem = jest.fn(() => 'ETag');

				service.fetchNotifications();

				expect(localStorage.setItem).toHaveBeenNthCalledWith(1, 'ecNotificationETag', 'ETag');
			});

			it('should set localStorage item from body', () => {
				localStorage.getItem = jest.fn(() => 'ETag');
				mockResponse.body = [];
				getMock.mockReturnValue(of(mockResponse));

				service.fetchNotifications();

				expect(localStorage.setItem).toHaveBeenNthCalledWith(2, 'ecNotifications', JSON.stringify([]));
			});

			const oneDayAgoMoment = moment();
			const oneHourAgoMoment = moment();
			const inOneDayMoment = moment();
			const in7DaysMoment = moment();
			const in14DaysMoment = moment();
			const inOneHourMoment = moment();
			oneDayAgoMoment.subtract(1, 'days');
			oneHourAgoMoment.subtract(1, 'hours');
			inOneDayMoment.add(1, 'days');
			in7DaysMoment.add(7, 'days');
			in14DaysMoment.add(14, 'days');
			inOneHourMoment.add(1, 'hours');

			const oneDayAgo = oneDayAgoMoment.toISOString();
			const oneHourAgo = oneHourAgoMoment.toISOString();
			const inOneDay = inOneDayMoment.toISOString();
			const inOneHour = inOneHourMoment.toISOString();

			it.each([
				[1, [{start: inOneHour, end: in7DaysMoment, shouldShow: true}]],
				[
					2,
					[
						{start: inOneHour, end: in7DaysMoment, shouldShow: true},
						{start: in7DaysMoment, end: in14DaysMoment, shouldShow: true}
					]
				],
				[
					2,
					[
						{start: oneHourAgo, end: inOneHour, shouldShow: false},
						{start: oneDayAgo, end: inOneHour, shouldShow: false},
						{start: inOneHour, end: inOneDay, shouldShow: true},
						{start: in7DaysMoment, end: in14DaysMoment, shouldShow: true}
					]
				]
			])(
				'should emit %s notifications for %o',
				fakeAsync(
					(
						expectedNotificationLength: number,
						notifications: { start: string; end: string; shouldShow: boolean }[]
					) => {
						JSON.parse = jest
							.fn()
							.mockReturnValueOnce(notifications)
							.mockReturnValueOnce([...notifications.map(_ => false)]);

						service.upcomingNotifications$.subscribe(notificationsUnderTest => {
							expect(notificationsUnderTest.length).toBe(expectedNotificationLength);
							// @ts-ignore
							expect(notificationsUnderTest.every(n => n.shouldShow === true)).toBe(true);
						});

						service.fetchNotifications();
						tick();
					}
				)
			);
		});
	});

	it('should unsubscribe when service is destroyed', () => {
		// @ts-ignore
		service.subscription = interval(1000).subscribe();
		// @ts-ignore
		const unsubSpy = jest.spyOn(service.subscription, 'unsubscribe');

		service.ngOnDestroy();
		expect(unsubSpy).toHaveBeenCalled();
	});
});
