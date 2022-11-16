import {Component} from '@angular/core';
import {ObNotificationService} from '@oblique/oblique';
import {Notification, NotificationService} from './notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';

@Component({
	selector: 'ec-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
	nonClosableNotifications$: Observable<Notification[]>;

	get currentLang() {
		return this.translateService.currentLang;
	}

	constructor(
		private readonly notificationService: NotificationService,
		private readonly obNotificationService: ObNotificationService,
		private readonly translateService: TranslateService
	) {
		this.nonClosableNotifications$ = notificationService.nonClosableNotifications$;
	}
}
