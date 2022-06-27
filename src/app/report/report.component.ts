import {Component, ViewChild} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';

@Component({
	selector: 'ec-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss']
})
export class ReportComponent {
	@ViewChild('stepper') stepper: MatStepper;
}
