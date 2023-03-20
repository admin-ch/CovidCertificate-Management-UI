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
	START_DATE = '';

	constructor(
		public readonly translate: TranslateService,
		private readonly reportService: ReportService,
		@Inject(REPORT_ERROR_STATE_MATCHER) public readonly matcher: ErrorStateMatcher
	) {}

	ngOnInit() {
		const now = moment();
		const twoYearsAgo = now.subtract(2, 'years');
		if (twoYearsAgo.isAfter(this.MIN_DATE)) {
			this.MIN_DATE = twoYearsAgo;
		}
		this.START_DATE = this.MIN_DATE.clone().subtract(1, 'days').format('DD.MM.YYYY');

		this.subscription = this.reportService.reset$.subscribe(() => {
			this.dateFromFormControl.reset();
			this.dateToFormControl.reset();
		});
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}
}
