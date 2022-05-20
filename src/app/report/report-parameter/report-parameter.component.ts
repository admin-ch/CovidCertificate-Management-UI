import {Component, EventEmitter, Output} from '@angular/core';
import {ReportService} from "../report.service";
import {ReportType} from "shared/model";

@Component({
	selector: 'ec-report-parameter',
	templateUrl: './report-parameter.component.html',
	styleUrls: ['./report-parameter.component.scss']
})
export class ReportParameterComponent {

	@Output()
	next: EventEmitter<void> = new EventEmitter<void>()

	@Output()
	back: EventEmitter<void> = new EventEmitter<void>()

	ReportType = ReportType

	constructor(public readonly reportService: ReportService) {
	}

	goNext(): void {
		this.next.emit();
	}
}

