import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm, UntypedFormArray, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {ReportService} from '../../report.service';
import {ReportType} from 'shared/model';
import {TranslateService} from '@ngx-translate/core';

@Component({
	selector: 'ec-report-a7',
	templateUrl: './report-a7.component.html',
	styleUrls: ['./report-a7.component.scss']
})
export class ReportA7Component implements OnInit, OnDestroy {
	@ViewChild('ngForm') ngForm: NgForm;

	a7FormGroup: UntypedFormGroup;
	cantonFormControl: UntypedFormControl;
	dateFromFormControl: UntypedFormControl;
	dateToFormControl: UntypedFormControl;
	certTypesFormArray: UntypedFormArray;

	constructor(public readonly reportService: ReportService, public readonly translate: TranslateService) {}

	ngOnInit(): void {
		this.a7FormGroup = this.reportService.formGroup.get(ReportType.A7) as UntypedFormGroup;
		this.cantonFormControl = this.a7FormGroup.get('canton') as UntypedFormControl;
		this.dateFromFormControl = this.a7FormGroup.get('from') as UntypedFormControl;
		this.dateToFormControl = this.a7FormGroup.get('to') as UntypedFormControl;
		this.certTypesFormArray = this.a7FormGroup.get('types') as UntypedFormArray;
		this.a7FormGroup.enable();
		setTimeout(() => this.ngForm.resetForm(this.a7FormGroup.value));
	}

	ngOnDestroy() {
		this.a7FormGroup.disable();
	}
}
