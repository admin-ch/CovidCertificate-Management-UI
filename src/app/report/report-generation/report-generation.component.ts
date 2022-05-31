import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ReportService} from "../report.service";
import {ReportType} from "shared/model";
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";
import {MatHorizontalStepper} from "@angular/material/stepper";

export enum GenerationResponseStatus {
	OK = 'OK',
	PARTIAL = 'PARTIAL',
	TOO_BIG = 'TOO_BIG'
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
			this.http.post(url, this.reportService.parameter[this.reportService.selectedReportType], {
				responseType: 'blob'
			}).subscribe({
				next: blob => {
					// TODO: Implement emitters for status other than OK when backend is ready.
					this.reportService.reportFinished$.next(GenerationResponseStatus.OK)
					const link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
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

