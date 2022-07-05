import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ReportService} from '../../report.service';
import {ReportType} from 'shared/model';
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";

export enum CertificateType {
	// EU compatible certs
	T = "T",       // Tested
	V = "V",       // Vaccinated
	R = "R",       // Recovered
	RREU = "RREU", // Recovered (Rapid Antigen Test EU)

	// CH certs
	ME = "ME",     // Medical Exception
	A = "A",       // Antibody
	RR = "RR",     // Recovered (Rapid Antigen Test)
	VT = "VT",     // Vaccinated Tourists
}

@Component({
	selector: 'ec-report-a7',
	templateUrl: './report-a7.component.html',
	styleUrls: ['./report-a7.component.scss']
})
export class ReportA7Component implements OnInit, OnDestroy {

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
		this.certTypesFormArray.clear()
		this.a7FormGroup.markAsUntouched()
	}
}
