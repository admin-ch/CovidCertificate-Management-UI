import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, NgForm} from '@angular/forms';
import {ReportService} from '../../report.service';
import {ReportType} from 'shared/model';
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";

@Component({
	selector: 'ec-report-a7',
	templateUrl: './report-a7.component.html',
	styleUrls: ['./report-a7.component.scss']
})
export class ReportA7Component implements OnInit, OnDestroy {
	@ViewChild('ngForm') ngForm: NgForm

	a7FormGroup: FormGroup;
	cantonFormControl: FormControl;
	dateFromFormControl: FormControl;
	dateToFormControl: FormControl;
	certTypesFormArray: FormArray;

	subscription: Subscription

	constructor(public readonly reportService: ReportService,
				public readonly translate: TranslateService) {
	}

	ngOnInit(): void {
		this.a7FormGroup = this.reportService.formGroup.get(ReportType.A7) as FormGroup
		this.cantonFormControl = this.a7FormGroup.get('canton') as FormControl
		this.dateFromFormControl = this.a7FormGroup.get('from') as FormControl
		this.dateToFormControl = this.a7FormGroup.get('to') as FormControl
		this.certTypesFormArray = this.a7FormGroup.get('types') as FormArray
		this.a7FormGroup.enable()
		this.subscription = this.reportService.reset$.subscribe(() => this.resetInput())
		setTimeout(() => this.ngForm.resetForm(this.a7FormGroup.value))
	}

	ngOnDestroy() {
		this.a7FormGroup.disable()
		this.subscription?.unsubscribe()
	}

	resetInput(): void {
		this.a7FormGroup.reset({
			from: '',
			to: '',
			canton: ''
		});
	}
}
