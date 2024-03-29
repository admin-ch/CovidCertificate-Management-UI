import {Component, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {ReportService} from '../../report.service';
import {ReportType} from 'shared/model';
import {uvciValidator} from '../../../create/utils/uvci-validator';

@Component({
	selector: 'ec-report-a2',
	templateUrl: './report-a2.component.html',
	styleUrls: ['./report-a2.component.scss']
})
export class ReportA2Component implements OnInit, OnDestroy {
	a2FormGroup: UntypedFormGroup;
	uvcisFormControl: UntypedFormControl;
	uvciValidator = uvciValidator;

	constructor(public readonly reportService: ReportService) {}

	ngOnInit(): void {
		this.a2FormGroup = this.reportService.formGroup.get(ReportType.A2) as UntypedFormGroup;
		this.uvcisFormControl = this.a2FormGroup.get('uvcis') as UntypedFormControl;
		this.a2FormGroup.enable();
	}

	ngOnDestroy() {
		this.a2FormGroup.disable();
	}
}
