import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ReportService} from '../report.service';
import {ReportType} from 'shared/model';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {MatStepper} from '@angular/material/stepper';
import {ObNotificationService} from '@oblique/oblique';
import {TranslateService} from '@ngx-translate/core';

export enum GenerationResponseStatus {
	OK = 'OK',
	INCOMPLETE = 'INCOMPLETE'
}

export interface ReportResponse {
	report: string; // Base64 encoded
	httpStatus: string;
	error?: unknown; // Currently not explicitly used
	details?: {
		infoCode: number;
	};
}

@Component({
	selector: 'ec-report-generation',
	templateUrl: './report-generation.component.html',
	styleUrls: ['./report-generation.component.scss']
})
export class ReportGenerationComponent implements OnInit, OnDestroy {
	private readonly URL = '/api/v2/report';
	private subscription: Subscription;

	constructor(
		@Inject(MatStepper) private readonly stepper: MatStepper,
		private readonly reportService: ReportService,
		private readonly http: HttpClient,
		private readonly obNotificationService: ObNotificationService,
		private readonly translate: TranslateService,
		@Inject('REPORT_HOST') private readonly REPORT_HOST: string
	) {}

	ngOnInit() {
		this.subscription = this.reportService.generateReport$.subscribe(() => {
			let url = this.REPORT_HOST + this.URL;
			switch (this.reportService.selectedReportType) {
				case ReportType.A2:
					url += '/fraud/a2/by_uvci';
					break;
				case ReportType.A3:
					url += '/fraud/a3/for_timerange_by_users';
					break;
				case ReportType.A4:
					url += '/fraud/a4/by_users_and_types';
					break;
				case ReportType.A7:
					url += '/fraud/a7';
					break;
				case ReportType.A8:
					url += '/certificate/statistics/a8/for_timerange_by_week';
					break;
				case ReportType.A9:
					url += '/certificate/statistics/a9/for_timerange_by_types';
					break;
				case ReportType.A11:
					url += '/fraud/a11/for_timerange_by_canton';
					break;
				case ReportType.A12:
					url += '/fraud/a12/for_transfer_codes';
					break;
				case ReportType.A13:
					url += '/fraud/a13/for_timerange_by_canton';
					break;
				default:
					console.error(`Selected report type "${this.reportService.selectedReportType}" not found.`);
			}
			this.http.post(url, this.reportService.formGroup.get(this.reportService.selectedReportType).value).subscribe({
				next: (response: ReportResponse) => {
					if (response.details?.infoCode === 1005) {
						this.obNotificationService.error(this.translate.instant('reports.excelLimitExceeded'));
						this.stepper.previous();
						return;
					}

					this.reportService.reportFinished$.next(response.details ? GenerationResponseStatus.INCOMPLETE : GenerationResponseStatus.OK);
					const link = document.createElement('a');
					link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${response.report}`;
					link.download = `covid-certificate-${this.reportService.selectedReportType}-${Date.now()}.xlsx`;
					link.click();
					link.remove();
					this.stepper.next();
				},
				error: () => this.stepper.previous()
			});
		});
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}
}
