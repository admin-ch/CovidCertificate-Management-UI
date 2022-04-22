import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {of, Subscription, timer} from "rxjs";
import {catchError, switchMap} from "rxjs/operators";


export interface Notification {
	type: 'INFO' | 'WARNING',
	message: {
		de: string,
		en: string,
		fr: string,
		it: string
	},
	start: string,
	end: string
}

@Injectable({
	providedIn: 'root'
})
export class NotificationService implements OnDestroy {

	private readonly LOCALSTORAGE_KEY = 'ecNotificationETag'
	private subscription: Subscription;

	constructor(private readonly http: HttpClient,
				@Inject('NOTIFICATION_HOST') private NOTIFICATION_HOST: string) {
	}

	fetchNotifications() {
		const storedHash = localStorage.getItem(this.LOCALSTORAGE_KEY)
		const headers = {}
		if (storedHash) {
			headers['If-None-Match'] = storedHash
		}

		// Pull every 15 minutes.
		this.subscription = timer(0, 1000 * 60 * 15)
			.pipe(
				switchMap(() => this.http.get<HttpResponse<Notification[]>>(`${this.NOTIFICATION_HOST}/api/v1/notifications/`, {
						headers,
						observe: 'response'
					})
				),
				// Angular's `HttpClient` handles HTTP status 304 as error, so we need to catch it in order to not get caught
				// by the `HttpResponsesInterceptor`.
				catchError(response => of(response)))
			.subscribe(response => {
				// If status is "304 Not Modified", there have been no changes since the last pull.
				if (response.status !== 304) {
					localStorage.setItem(this.LOCALSTORAGE_KEY, response.headers.get('ETag'))
					// TODO: Provide new notifications to the user.
				}
			})
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe()
	}
}
