import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
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

	a8FormGroup: FormGroup;
	dateFromFormControl: FormControl;
	dateToFormControl: FormControl;
	certTypesFormArray: FormArray;

	subscription: Subscription;

	constructor(public readonly reportService: ReportService, public readonly translate: TranslateService) {}

	ngOnInit(): void {
		this.a8FormGroup = this.reportService.formGroup.get(ReportType.A8) as FormGroup;
		this.dateFromFormControl = this.a8FormGroup.get('from') as FormControl;
		this.dateToFormControl = this.a8FormGroup.get('to') as FormControl;
		this.certTypesFormArray = this.a8FormGroup.get('types') as FormArray;
		this.a8FormGroup.enable();
		this.subscription = this.reportService.reset$.subscribe(() => this.resetInput());
		setTimeout(() => this.ngForm.resetForm(this.a8FormGroup.value));
	}

	ngOnDestroy() {
		this.a8FormGroup.disable();
		this.subscription?.unsubscribe();
	}

	resetInput(): void {
		this.a8FormGroup.reset({
			from: '',
			to: ''
		});
	}
}
