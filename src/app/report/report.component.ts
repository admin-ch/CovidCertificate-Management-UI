import {Component, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';
import {ReportType} from "shared/model";

@Component({
	selector: 'ec-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
	@ViewChild('stepper') stepper: MatStepper;

	selectedForm: ReportType;

	constructor(
	) {}

	ngOnInit() {
	}

	backCalled(): void {
		this.stepper.previous();
	}

	nextCalled(): void {
		this.stepper.next();
	}

	resetCalled(): void {
		this.stepper.reset();
	}
}
