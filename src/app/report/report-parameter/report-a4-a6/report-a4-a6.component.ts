import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm, UntypedFormArray, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {ReportService} from '../../report.service';
import {IssuerType, ReportType} from 'shared/model';
import {ReplaySubject, Subscription} from 'rxjs';
import {delay, distinctUntilChanged, tap} from 'rxjs/operators';
import {SelectedProfilesService} from '../_shared/selected-profiles.service';

@Component({
	selector: 'ec-report-a4-a6',
	templateUrl: './report-a4-a6.component.html',
	styleUrls: ['./report-a4-a6.component.scss']
})
export class ReportA4A6Component implements OnInit, OnDestroy {
	@ViewChild('ngForm') ngForm: NgForm;

	IssuerType = IssuerType;

	a4a6FormGroup: UntypedFormGroup;
	dateFromFormControl: UntypedFormControl;
	dateToFormControl: UntypedFormControl;
	cantonFormControl: UntypedFormControl;
	certTypesFormArray: UntypedFormArray;
	userIdsFormArray: UntypedFormArray;

	searchType = IssuerType.ORGANISATION;
	unitSearchAuthority$: ReplaySubject<string> = new ReplaySubject<string>();
	subscription: Subscription;

	constructor(public readonly reportService: ReportService, private readonly selectedProfilesService: SelectedProfilesService) {}

	ngOnInit(): void {
		this.a4a6FormGroup = this.reportService.formGroup.get(ReportType.A4) as UntypedFormGroup;
		this.dateFromFormControl = this.a4a6FormGroup.get('from') as UntypedFormControl;
		this.dateToFormControl = this.a4a6FormGroup.get('to') as UntypedFormControl;
		this.cantonFormControl = this.a4a6FormGroup.get('canton') as UntypedFormControl;
		this.certTypesFormArray = this.a4a6FormGroup.get('types') as UntypedFormArray;
		this.userIdsFormArray = this.a4a6FormGroup.get('userIds') as UntypedFormArray;
		this.a4a6FormGroup.enable();
		setTimeout(() => this.ngForm.resetForm(this.a4a6FormGroup.value));

		// We emit through ReplaySubject to emit latest emitted value on subscription.
		this.subscription = this.cantonFormControl.valueChanges
			.pipe(
				distinctUntilChanged(),

				// Clear selected profiles to prevent having selected profiles from different data rooms.
				tap(() => this.selectedProfilesService.clear()),

				// Delay changes for unit search to emit after next tick since the async pipe for the authority
				// input may cause ExpressionChangedAfterItHasBeenChecked if asynced without delay.
				delay(0)
			)
			.subscribe(this.unitSearchAuthority$);
	}

	ngOnDestroy() {
		this.a4a6FormGroup.disable();
		this.subscription?.unsubscribe();
	}
}
