import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {ReportService} from "../../report.service";
import {ReportType} from "shared/model";

@Component({
	selector: 'ec-report-a11',
	templateUrl: './report-a11.component.html',
	styleUrls: ['./report-a11.component.scss']
})
export class ReportA11Component implements OnInit, OnDestroy {

	@ViewChild('ngForm') ngForm: NgForm

	a11FormGroup: FormGroup;
	dateFromFormControl: FormControl;
	dateToFormControl: FormControl;
	cantonFormControl: FormControl;

	subscription: Subscription

	constructor(public readonly reportService: ReportService) {
	}

	ngOnInit(): void {
		this.a11FormGroup = this.reportService.formGroup.get(ReportType.A11) as FormGroup
		this.dateFromFormControl = this.a11FormGroup.get('from') as FormControl
		this.dateToFormControl = this.a11FormGroup.get('to') as FormControl
		this.cantonFormControl = this.a11FormGroup.get('canton') as FormControl
		this.a11FormGroup.enable()
		setTimeout(() => this.ngForm.resetForm(this.a11FormGroup.value))
	}

	ngOnDestroy() {
		this.a11FormGroup.disable()
		this.subscription?.unsubscribe()
	}

	resetInput(): void {
		this.a11FormGroup.reset({
			from: '',
			to: '',
			canton: '',
		});
	}
}
