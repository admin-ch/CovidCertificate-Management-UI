import {Component, Inject} from '@angular/core';
import {ReportService} from "../report.service";
import {ReportType} from "shared/model";
import {MatHorizontalStepper} from "@angular/material/stepper";

@Component({
	selector: 'ec-report-parameter',
	templateUrl: './report-parameter.component.html',
	styleUrls: ['./report-parameter.component.scss']
})
export class ReportParameterComponent {

	ReportType = ReportType

	constructor(@Inject(MatHorizontalStepper) public readonly stepper: MatHorizontalStepper,
				public readonly reportService: ReportService) {
	}

	goNext(): void {
		this.reportService.generateReport$.next()
		this.stepper.next();
	}
}

