import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm, UntypedFormArray, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {ReportType} from 'shared/model';
import {ReportService} from '../../report.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
	selector: 'ec-report-a8',
	templateUrl: './report-a8.component.html',
	styleUrls: ['./report-a8.component.scss']
})
export class ReportA8Component implements OnInit, OnDestroy {
	@ViewChild('ngForm') ngForm: NgForm;

	a8FormGroup: UntypedFormGroup;
	dateFromFormControl: UntypedFormControl;
	dateToFormControl: UntypedFormControl;
	certTypesFormArray: UntypedFormArray;

	constructor(public readonly reportService: ReportService, public readonly translate: TranslateService) {}

	ngOnInit(): void {
		this.a8FormGroup = this.reportService.formGroup.get(ReportType.A8) as UntypedFormGroup;
		this.dateFromFormControl = this.a8FormGroup.get('from') as UntypedFormControl;
		this.dateToFormControl = this.a8FormGroup.get('to') as UntypedFormControl;
		this.certTypesFormArray = this.a8FormGroup.get('types') as UntypedFormArray;
		this.a8FormGroup.enable();
		setTimeout(() => this.ngForm.resetForm(this.a8FormGroup.value));
	}

	ngOnDestroy() {
		this.a8FormGroup.disable();
	}
}
