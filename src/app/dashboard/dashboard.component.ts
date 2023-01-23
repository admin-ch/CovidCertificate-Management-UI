import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthFunction} from '../auth/auth.service';
import {ObNotificationService} from '@oblique/oblique';
import {NotificationService} from '../notifications/notification.service';
import {ObINotification} from '@oblique/oblique/lib/notification/notification.model';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

@Component({
	selector: 'ec-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
	AuthFunction: typeof AuthFunction = AuthFunction;

	private subscription: Subscription;

	constructor(
		private readonly router: Router,
		private readonly notificationService: NotificationService,
		private readonly obNotificationService: ObNotificationService,
		private readonly translateService: TranslateService
	) {}

	goToCacheReset() {
		this.router.navigateByUrl('cache-reset');
	}

	goToCertificateCreate() {
		this.router.navigateByUrl('certificate-create');
	}

	goToCertificateRevoke() {
		this.router.navigateByUrl('certificate-revoke');
	}

	goToGenerateOtp() {
		this.router.navigateByUrl('otp');
	}

	goToGenerateMultipleCertificates() {
		this.router.navigateByUrl('upload');
	}

	goToGenerateReports() {
		this.router.navigateByUrl('report');
	}

	goToNotificationsManagement() {
		this.router.navigateByUrl('notifications-management');
	}

	goToRevokeMultipleCertificates() {
		this.router.navigateByUrl('bulk-revocation');
	}

	ngOnInit() {
		this.subscription = this.notificationService.closableNotifications$.subscribe(notifications => {
			for (const notification of notifications) {
				let notificationFn: (config: ObINotification | string) => ObINotification;
				switch (notification.type) {
					case 'INFO':
						notificationFn = this.obNotificationService.info.bind(this.obNotificationService);
						break;
					case 'WARNING':
						notificationFn = this.obNotificationService.warning.bind(this.obNotificationService);
						break;
				}
				notificationFn({message: notification.content[this.translateService.currentLang], sticky: true});
			}
		});
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}
}
