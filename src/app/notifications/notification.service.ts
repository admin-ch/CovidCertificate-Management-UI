import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable, of, ReplaySubject, Subject, Subscription, throwError, timer} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import * as moment from 'moment';

export interface Notification {
	type: 'INFO' | 'WARNING';
	message: {
		de: string;
		en: string;
		fr: string;
		it: string;
	};
	start: string;
	end: string;
}

@Injectable({
	providedIn: 'root'
})
export class NotificationService implements OnDestroy {
	public imminentNotifications$: Observable<Notification[]>;
	public upcomingNotifications$: Observable<Notification[]>;

	private imminentNotifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);
	private upcomingNotifications: Subject<Notification[]> = new Subject<Notification[]>();
	private readonly ETAG_LOCALSTORAGE_KEY = 'ecNotificationETag';
	private readonly NOTIFICATIONS_LOCALSTORAGE_KEY = 'ecNotifications';
	private readonly NOTIFICATIONS_SHOWN_LOCALSTORAGE_KEY = 'ecUpcomingNotificationsShown';
	private subscription: Subscription;

	constructor(
		private readonly http: HttpClient,
		@Inject('NOTIFICATION_HOST') private NOTIFICATION_HOST: string,
		@Inject('IS_NOTIFICATION_SERVICE_ENABLED') private isNotificationServiceEnabled: boolean
	) {
		this.imminentNotifications$ = this.imminentNotifications.asObservable();
		this.upcomingNotifications$ = this.upcomingNotifications.asObservable();
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
						return this.http
							.get<HttpResponse<Notification[]>>(`${this.NOTIFICATION_HOST}/api/v1/notifications/`, {
								headers,
								observe: 'response'
							})
							.pipe(
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
						localStorage.setItem(
							this.NOTIFICATIONS_SHOWN_LOCALSTORAGE_KEY,
							JSON.stringify(shownNotificationsMap)
						);
					}
					this.emitUpcomingIfExisting();
					this.emitImminentIfExisting();
				});
		}
	}

	private emitImminentIfExisting() {
		const notifications = JSON.parse(localStorage.getItem(this.NOTIFICATIONS_LOCALSTORAGE_KEY));
		const imminentNotifications = [];
		if (notifications) {
			for (const notification of notifications) {
				const now = moment();
				const start = moment(notification.start);
				const end = moment(notification.end);

				if (now.isBetween(start, end)) {
					imminentNotifications.push(notification);
				}
			}
		}
		this.imminentNotifications.next(imminentNotifications);
	}

	private emitUpcomingIfExisting() {
		const notifications: Notification[] = JSON.parse(localStorage.getItem(this.NOTIFICATIONS_LOCALSTORAGE_KEY));
		const shownNotificationsMap = JSON.parse(localStorage.getItem(this.NOTIFICATIONS_SHOWN_LOCALSTORAGE_KEY));
		const upcomingNotifications = [];

		notifications?.forEach((notification, i) => {
			// We only want to emit notifications which have not been shown to the user yet.
			if (shownNotificationsMap[i] !== true) {
				const now = moment();
				const start = moment(notification.start);
				const rangeEnd = moment();
				rangeEnd.add(7, 'days');

				if (start.isBetween(now, rangeEnd)) {
					upcomingNotifications.push(notification);
					shownNotificationsMap[i] = true;
					localStorage.setItem(
						this.NOTIFICATIONS_SHOWN_LOCALSTORAGE_KEY,
						JSON.stringify(shownNotificationsMap)
					);
				}
			}
		});
		this.upcomingNotifications.next(upcomingNotifications);
	}
}
