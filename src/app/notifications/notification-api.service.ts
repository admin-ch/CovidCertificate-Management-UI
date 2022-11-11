import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Notification} from './notification.service';
import {Observable} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class NotificationApiService {
	constructor(private readonly http: HttpClient, @Inject('NOTIFICATION_HOST') private readonly NOTIFICATION_HOST: string) {}

	public getHttpResponse(headers: {[header: string]: string | string[]}): Observable<HttpResponse<Notification[]>> {
		return this.http.get<Notification[]>(`${this.NOTIFICATION_HOST}/api/v1/notifications/`, {
			headers,
			observe: 'response'
		});
	}

	public get(): Observable<Notification[]> {
		return this.http.get<Notification[]>(`${this.NOTIFICATION_HOST}/api/v1/notifications/`);
	}

	public post(body: Notification): Observable<void> {
		return this.http.post<void>(`${this.NOTIFICATION_HOST}/api/v1/notifications/`, body);
	}

	public put(body: Notification): Observable<void> {
		return this.http.put<void>(`${this.NOTIFICATION_HOST}/api/v1/notifications/`, body);
	}

	public delete(id: string): Observable<void> {
		return this.http.delete<void>(`${this.NOTIFICATION_HOST}/api/v1/notifications/${id}`);
	}
}
