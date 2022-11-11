import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationManagementService} from '../notification-management.service';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment/moment';
import {NotificationApiService} from '../../notification-api.service';
import {Notification} from '../../notification.service';
import {Moment} from 'moment';
import {ObNotificationService} from '@oblique/oblique';
import {getStartDateBeforeEndDateValidator} from 'shared/validators/date-time.validator';

@Component({
	selector: 'ec-notifications-management-edit',
	templateUrl: './notifications-management-edit.component.html',
	styleUrls: ['./notifications-management-edit.component.scss']
})
export class NotificationsManagementEditComponent implements OnInit {
	formGroup: UntypedFormGroup;
	isLoading = false;
	type: 'CREATE' | 'EDIT';
	MIN_DATE = moment();

	constructor(
		private readonly notificationManagementService: NotificationManagementService,
		private readonly router: Router,
		private readonly fb: UntypedFormBuilder,
		public readonly translate: TranslateService,
		private readonly notificationsApiService: NotificationApiService,
		private readonly obNotificationService: ObNotificationService
	) {}

	ngOnInit(): void {
		this.type = this.notificationManagementService.currentNotification ? 'EDIT' : 'CREATE';
		if (this.type === 'EDIT') {
			const startDateMoment = moment(this.notificationManagementService.currentNotification.startTime);
			if (startDateMoment.isBefore(this.MIN_DATE)) {
				this.MIN_DATE = startDateMoment;
			}
		}

		let startDate;
		let startTime;
		let endDate;
		let endTime;
		let type = 'INFO';
		let isClosable = true;
		let content = {};

		if (this.type === 'EDIT') {
			startDate = moment(this.notificationManagementService.currentNotification.startTime);
			startTime = moment(startDate).format('HH:mm');
			endDate = moment(this.notificationManagementService.currentNotification.endTime);
			endTime = moment(endDate).format('HH:mm');
			type = this.notificationManagementService.currentNotification.type;
			isClosable = this.notificationManagementService.currentNotification.isClosable;
			content = this.notificationManagementService.currentNotification.content;
		}

		this.formGroup = this.fb.group(
			{
				startDate: [startDate, [Validators.required]],
				startTime: [startTime, [Validators.required]],
				endDate: [endDate, [Validators.required]],
				endTime: [endTime, [Validators.required]],
				type: [type, [Validators.required]],
				isClosable: [isClosable]
			},
			{
				validators: [getStartDateBeforeEndDateValidator('startDate', 'endDate', 'startTime', 'endTime')]
			}
		);

		this.formGroup.get('startDate').valueChanges.subscribe(value => {
			if (value) {
				this.formGroup.get('startDate').setValue(moment(`${(value as Moment).format('YYYY-MM-DD')} ${this.formGroup.value.startTime}`, 'YYYY-MM-DD HH:mm'), {
					emitEvent: false
				});
			}
		});
		this.formGroup.get('startTime').valueChanges.subscribe(value => {
			if (value) {
				this.formGroup.get('startDate').setValue(moment(`${(this.formGroup.value.startDate as Moment).format('YYYY-MM-DD')} ${value}`, 'YYYY-MM-DD HH:mm'), {
					emitEvent: false
				});
			}
		});
		this.formGroup.get('endDate').valueChanges.subscribe(value => {
			if (value) {
				this.formGroup.get('endDate').setValue(moment(`${(value as Moment).format('YYYY-MM-DD')} ${this.formGroup.value.endTime}`, 'YYYY-MM-DD HH:mm'), {
					emitEvent: false
				});
			}
		});
		this.formGroup.get('endTime').valueChanges.subscribe(value => {
			if (value) {
				this.formGroup.get('endDate').setValue(moment(`${(this.formGroup.value.endDate as Moment).format('YYYY-MM-DD')} ${value}`, 'YYYY-MM-DD HH:mm'), {
					emitEvent: false
				});
			}
		});

		this.translate.langs.forEach(lang => this.formGroup.addControl(`content_${lang}`, new UntypedFormControl(content[lang], [Validators.required])));
	}

	save(): void {
		if (this.formGroup.valid) {
			const content = {};
			this.translate.langs.forEach(lang => (content[lang] = this.formGroup.value[`content_${lang}`]));

			const body: Notification = {
				id: this.notificationManagementService.currentNotification?.id,
				startTime: this.formGroup.get('startDate').value.utc().format('YYYY-MM-DDTHH:mm'),
				endTime: this.formGroup.get('endDate').value.utc().format('YYYY-MM-DDTHH:mm'),
				type: this.formGroup.value.type,
				isClosable: this.formGroup.value.isClosable,
				content
			};

			const method = this.type === 'EDIT' ? this.notificationsApiService.put : this.notificationsApiService.post;

			method.call(this.notificationsApiService, body).subscribe(() => {
				this.isLoading = false;
				this.router.navigate(['notifications-management']);
				this.obNotificationService.success(this.translate.instant('notificationsManagement.success.saved'));
			});
			this.isLoading = true;
		} else {
			this.formGroup.markAllAsTouched();
		}
	}
}
