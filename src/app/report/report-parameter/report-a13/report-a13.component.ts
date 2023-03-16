import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ReportService} from '../../report.service';
import {NgForm, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ReportType} from 'shared/model';
import * as moment from 'moment/moment';

@Component({
	selector: 'ec-report-a13',
	templateUrl: './report-a13.component.html',
	styleUrls: ['./report-a13.component.scss']
})
export class ReportA13Component implements OnInit, OnDestroy {
	@ViewChild('ngForm') ngForm: NgForm;

	a13FormGroup: UntypedFormGroup;
	dateFromFormControl: UntypedFormControl;
	dateToFormControl: UntypedFormControl;
	cantonFormControl: UntypedFormControl;
	// temporary value for testing purposes
	readonly MIN_DATE = moment('2021-01-01');
	// original value
	// readonly MIN_DATE = moment('2021-08-07');


	subscription: Subscription;

	constructor(public readonly reportService: ReportService) {}

	ngOnInit(): void {
		this.a13FormGroup = this.reportService.formGroup.get(ReportType.A13) as UntypedFormGroup;
		this.dateFromFormControl = this.a13FormGroup.get('from') as UntypedFormControl;
		this.dateToFormControl = this.a13FormGroup.get('to') as UntypedFormControl;
		this.cantonFormControl = this.a13FormGroup.get('canton') as UntypedFormControl;
		this.a13FormGroup.enable();
		setTimeout(() => this.ngForm.resetForm(this.a13FormGroup.value));
	}

	ngOnDestroy(): void {
		this.a13FormGroup.disable();
		this.subscription?.unsubscribe();
	}

	resetInput(): void {
		this.a13FormGroup.reset({
			from: '',
			to: '',
			canton: ''
		});
	}
}
