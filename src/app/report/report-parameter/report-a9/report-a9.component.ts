import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormGroup, NgForm} from "@angular/forms";
import {ReportType} from "shared/model";
import {ReportService} from "../../report.service";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";

@Component({
  selector: 'ec-report-a9',
  templateUrl: './report-a9.component.html',
  styleUrls: ['./report-a9.component.scss']
})
export class ReportA9Component implements OnInit, OnDestroy {
	@ViewChild('ngForm') ngForm: NgForm;

	a9FormGroup: FormGroup;
	certTypesFormArray: FormArray;

	subscription: Subscription;

	constructor(public readonly reportService: ReportService,
				public readonly translate: TranslateService) { }

	ngOnInit(): void {
		this.a9FormGroup = this.reportService.formGroup.get(ReportType.A9) as FormGroup
		this.certTypesFormArray = this.a9FormGroup.get('types') as FormArray
		this.a9FormGroup.enable()
		this.subscription = this.reportService.reset$.subscribe(() => this.resetInput())
		setTimeout(() => this.ngForm.resetForm(this.a9FormGroup.value))
	}

	ngOnDestroy() {
		this.a9FormGroup.disable()
		this.subscription?.unsubscribe()
	}

	resetInput(): void {
		this.a9FormGroup.reset({
			types: [],
		});
	}
}
