import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {ReportService} from "../../report.service";
import {ReportType} from 'shared/model';
import {ReplaySubject, Subscription} from "rxjs";
import {delay} from "rxjs/operators";


@Component({
	selector: 'ec-report-a4-a6',
	templateUrl: './report-a4-a6.component.html',
	styleUrls: ['./report-a4-a6.component.scss']
})
export class ReportA4A6Component implements OnInit, OnDestroy {
	a4a6FormGroup: FormGroup;
	dateFromFormControl: FormControl;
	dateToFormControl: FormControl;
	cantonFormControl: FormControl;
	certTypesFormArray: FormArray;
	userIdsFormArray: FormArray;

	searchType: 'organisation' | 'issuer' = 'organisation'
	unitSearchAuthority$: ReplaySubject<string> = new ReplaySubject<string>()
	subscription: Subscription


	constructor(public readonly reportService: ReportService) {
	}

	ngOnInit(): void {
		this.a4a6FormGroup = this.reportService.formGroup.get(ReportType.A4) as FormGroup
		this.dateFromFormControl = this.a4a6FormGroup.get('from') as FormControl
		this.dateToFormControl = this.a4a6FormGroup.get('to') as FormControl
		this.cantonFormControl = this.a4a6FormGroup.get('canton') as FormControl
		this.certTypesFormArray = this.a4a6FormGroup.get('types') as FormArray
		this.userIdsFormArray = this.a4a6FormGroup.get('userIds') as FormArray
		this.a4a6FormGroup.enable()

		// Delay changes for unit search to emit after next tick since the async pipe for the authority
		// input may cause ExpressionChangedAfterItHasBeenChecked if asynced without delay.
		// We emit through ReplaySubject to emit latest emitted value on subscription.
		this.subscription = this.cantonFormControl.valueChanges.pipe(delay(0)).subscribe(this.unitSearchAuthority$)
	}

	ngOnDestroy() {
		this.a4a6FormGroup.disable()
		this.subscription?.unsubscribe()
	}

	resetInput(): void {
		this.a4a6FormGroup.reset({
			from: '',
			to: '',
			canton: '',
		});
	}
}
