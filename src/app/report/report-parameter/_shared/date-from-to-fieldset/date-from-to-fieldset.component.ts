import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UntypedFormControl} from '@angular/forms';
import * as moment from 'moment/moment';
import {ErrorStateMatcher} from '@angular/material/core';
import {REPORT_ERROR_STATE_MATCHER} from '../../../errorStateMatcher';
import {ReportService} from '../../../report.service';
import {Subscription} from 'rxjs';

@Component({
	selector: 'ec-date-from-to-fieldset',
	templateUrl: './date-from-to-fieldset.component.html',
	styleUrls: ['./date-from-to-fieldset.component.scss']
})
export class DateFromToFieldsetComponent implements OnInit, OnDestroy {
	@Input() dateFromFormControl: UntypedFormControl;
	@Input() dateToFormControl: UntypedFormControl;
	@Input() label: string;
	@Input() MIN_DATE = moment('2021-05-01');

	subscription: Subscription;

	readonly TODAY = moment();

	constructor(
		public readonly translate: TranslateService,
		private readonly reportService: ReportService,
		@Inject(REPORT_ERROR_STATE_MATCHER) public readonly matcher: ErrorStateMatcher
	) {}

	ngOnInit() {
		// Works like usual until 1.05.2021(default MIN_DATE), after that it will only accept 2 years in the past
		// TODO Correct Validation & Notification
		const now = moment();
		if (now > this.MIN_DATE.clone().add(2, 'years')) {
			this.MIN_DATE = now.subtract(2, 'years');
		}

		this.subscription = this.reportService.reset$.subscribe(() => {
			this.dateFromFormControl.reset();
			this.dateToFormControl.reset();
		});
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}
}
