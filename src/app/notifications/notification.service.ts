import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {Observable, ReplaySubject, Subject, Subscription, of, throwError, timer} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import * as moment from 'moment';
import {NotificationApiService} from './notification-api.service';

export interface Notification {
	id: string;
	type: 'INFO' | 'WARNING';
	isClosable: boolean;
	content: Record<string, string>;
	startTime: string;
	endTime: string;
}

@Injectable({
	providedIn: 'root'
})
export class NotificationService implements OnDestroy {
	public nonClosableNotifications$: Observable<Notification[]>;
	public closableNotifications$: Observable<Notification[]>;

	private readonly nonClosableNotifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);
	private readonly closableNotifications: Subject<Notification[]> = new Subject<Notification[]>();
	private readonly ETAG_LOCALSTORAGE_KEY = 'ecNotificationETag';
	private readonly NOTIFICATIONS_LOCALSTORAGE_KEY = 'ecNotifications';
	private readonly NOTIFICATIONS_SHOWN_LOCALSTORAGE_KEY = 'ecClosableNotificationsShown';
	private subscription: Subscription;

	constructor(
		private readonly apiService: NotificationApiService,
		@Inject('IS_NOTIFICATION_SERVICE_ENABLED') private readonly isNotificationServiceEnabled: boolean
	) {
		this.nonClosableNotifications$ = this.nonClosableNotifications.asObservable();
		this.closableNotifications$ = this.closableNotifications.asObservable();
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}

	fetchNotifications() {
		// this will only pull notifications on DEV, ABN and PROD.
		if (this.isNotificationServiceEnabled) {
			// Pull every 15 minutes.
			this.subscription = timer(0, 1000 * 60 * 15)
				.pipe(
					switchMap(() => {
						const storedHash = localStorage.getItem(this.ETAG_LOCALSTORAGE_KEY);
						const headers = {};
						if (storedHash) {
							headers['If-None-Match'] = storedHash;
						}
						return this.apiService.getHttpResponse(headers).pipe(
							// Angular's `HttpClient` handles HTTP status 304 as error, so we need to catch it in order to not get caught
							// by the `HttpResponsesInterceptor`.
							catchError(response => (response.status === 304 ? of(response) : throwError(response)))
						);
					})
				)
				.subscribe((response: HttpResponse<Notification[]>) => {
					// If status is "304 Not Modified", there have been no changes since the last pull.
					if (response.status !== 304) {
						localStorage.setItem(this.ETAG_LOCALSTORAGE_KEY, response.headers.get('ETag'));
						localStorage.setItem(this.NOTIFICATIONS_LOCALSTORAGE_KEY, JSON.stringify(response.body));

						// We create a map which its index is the index of the notification and its value is true or false
						// to define if the notification has already been shown to the user. We initialize it here, setting
						// all to false.
						const shownNotificationsMap = [];
						response.body?.forEach((_, i) => (shownNotificationsMap[i] = false));
						localStorage.setItem(this.NOTIFICATIONS_SHOWN_LOCALSTORAGE_KEY, JSON.stringify(shownNotificationsMap));
					}
					this.emitClosableIfExisting();
					this.emitNonClosableIfExisting();
				});
		}
	}

	private emitNonClosableIfExisting() {
		const notifications: Notification[] = JSON.parse(localStorage.getItem(this.NOTIFICATIONS_LOCALSTORAGE_KEY));
		const nonClosableNotifications = [];
		if (notifications) {
			for (const notification of notifications) {
				if (!notification.isClosable) {
					if (this.isNowInPeriod(notification)) {
						nonClosableNotifications.push(notification);
					}
				}
			}
		}
		this.nonClosableNotifications.next(nonClosableNotifications);
	}

	private emitClosableIfExisting() {
		const notifications: Notification[] = JSON.parse(localStorage.getItem(this.NOTIFICATIONS_LOCALSTORAGE_KEY));
		const shownNotificationsMap = JSON.parse(localStorage.getItem(this.NOTIFICATIONS_SHOWN_LOCALSTORAGE_KEY));
		const closableNotifications = [];

		notifications?.forEach((notification, i) => {
			// We only want to emit notifications which have not been shown to the user yet.
			if (shownNotificationsMap[i] !== true) {
				if (notification.isClosable) {
					if (this.isNowInPeriod(notification)) {
						closableNotifications.push(notification);
						shownNotificationsMap[i] = true;
						localStorage.setItem(this.NOTIFICATIONS_SHOWN_LOCALSTORAGE_KEY, JSON.stringify(shownNotificationsMap));
					}
				}
			}
		});
		this.closableNotifications.next(closableNotifications);
	}

	private isNowInPeriod(notification: Notification) {
		const now = moment.utc(Date.now());
		const start = moment.utc(notification.startTime);
		const end = moment.utc(notification.endTime);
		return now.isBetween(start, end);
	}
}
