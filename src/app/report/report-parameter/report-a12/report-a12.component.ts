import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {ReportType} from 'shared/model';
import {ReportService} from '../../report.service';

@Component({
	selector: 'ec-report-a12',
	templateUrl: './report-a12.component.html',
	styleUrls: ['./report-a12.component.scss']
})
export class ReportA12Component implements OnInit, OnDestroy {
	a12FormGroup: FormGroup;
	transferCodesFormControl: FormControl;

	constructor(public readonly reportService: ReportService) {}

	ngOnInit(): void {
		this.a12FormGroup = this.reportService.formGroup.get(ReportType.A12) as FormGroup;
		this.transferCodesFormControl = this.a12FormGroup.get('transferCodes') as FormControl;
		this.a12FormGroup.enable();
	}

	ngOnDestroy() {
		this.a12FormGroup.disable();
	}

	transferCodesValidator(control: AbstractControl): ValidationErrors | null {
		if (!(control.value as string)?.match(/^[a-zA-Z0-9]{9}$/g)) {
			return {
				format: true
			};
		}
		return null;
	}
}
