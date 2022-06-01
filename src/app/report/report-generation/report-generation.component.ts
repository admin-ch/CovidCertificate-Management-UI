import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ReportService} from "../report.service";
import {ReportType} from "shared/model";
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";
import {MatHorizontalStepper} from "@angular/material/stepper";

export enum GenerationResponseStatus {
	OK = 'OK',
	INCOMPLETE = 'INCOMPLETE'
}

export interface ReportResponse {
	report: string, // Base64 encoded
	httpStatus: string,
	error?: any
}

@Component({
	selector: 'ec-report-generation',
	templateUrl: './report-generation.component.html',
	styleUrls: ['./report-generation.component.scss']
})
export class ReportGenerationComponent implements OnInit, OnDestroy {

	private readonly URL = '/api/v2/report'
	private subscription: Subscription

	constructor(@Inject(MatHorizontalStepper) private readonly stepper: MatHorizontalStepper,
				private readonly reportService: ReportService,
				private readonly http: HttpClient,
				@Inject('REPORT_HOST') private readonly REPORT_HOST: string) {
	}

	ngOnInit() {
		this.subscription = this.reportService.generateReport$.subscribe(() => {
			let url = this.REPORT_HOST + this.URL
			switch (this.reportService.selectedReportType) {
				case ReportType.A2:
					url += '/fraud/a2/by_uvci'
					break
			}
			this.http.post(url, this.reportService.parameter[this.reportService.selectedReportType]).subscribe({
				next: (response: ReportResponse) => {
					this.reportService.reportFinished$.next(response.error ? GenerationResponseStatus.INCOMPLETE : GenerationResponseStatus.OK)
					const link = document.createElement('a');
					link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${response.report}`;
					link.download = `covid-certificate-${this.reportService.selectedReportType}-${Date.now()}.xlsx`;
					link.click();
					link.remove()
				},
				complete: () => this.stepper.next()
			})
		})
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe()
	}
}

