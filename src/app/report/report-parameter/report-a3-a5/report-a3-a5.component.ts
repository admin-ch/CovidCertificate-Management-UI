import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, NgForm} from "@angular/forms";
import {ReplaySubject, Subscription} from "rxjs";
import {ReportService} from "../../report.service";
import {ReportType, IssuerType} from "shared/model";
import {delay, distinctUntilChanged, tap} from "rxjs/operators";
import {SelectedProfilesService} from "../_shared/selected-profiles.service";

@Component({
  selector: 'ec-report-a3-a5',
  templateUrl: './report-a3-a5.component.html',
  styleUrls: ['./report-a3-a5.component.scss']
})
export class ReportA3A5Component implements OnInit, OnDestroy {
	@ViewChild('ngForm') ngForm: NgForm;

	IssuerType = IssuerType;

	a3a5FormGroup: FormGroup;
	dateFromFormControl: FormControl;
	dateToFormControl: FormControl;
	cantonFormControl: FormControl;
	userIdsFormArray: FormArray;


	unitSearchAuthority$: ReplaySubject<string> = new ReplaySubject<string>();
	searchType = IssuerType.ORGANISATION;
	subscription: Subscription;

  constructor(
	  private readonly reportService: ReportService,
	  private readonly selectedProfilesService: SelectedProfilesService
  ) { }

  ngOnInit(): void {
	  this.a3a5FormGroup = this.reportService.formGroup.get(ReportType.A3) as FormGroup;
	  this.dateFromFormControl = this.a3a5FormGroup.get('from') as FormControl;
	  this.dateToFormControl = this.a3a5FormGroup.get('to') as FormControl;
	  this.cantonFormControl = this.a3a5FormGroup.get('canton') as FormControl;
	  this.userIdsFormArray = this.a3a5FormGroup.get('userIds') as FormArray;
	  this.a3a5FormGroup.enable();
	  setTimeout(() => this.ngForm.resetForm(this.a3a5FormGroup.value));

	  // We emit through ReplaySubject to emit latest emitted value on subscription.
	  this.subscription = this.cantonFormControl.valueChanges
		  .pipe(
			  distinctUntilChanged(),

			  // Clear selected profiles to prevent having selected profiles from different data rooms.
			  tap(_ => this.selectedProfilesService.clear()),

			  // Delay changes for unit search to emit after next tick since the async pipe for the authority
			  // input may cause ExpressionChangedAfterItHasBeenChecked if asynced without delay.
			  delay(0)
		  )
		  .subscribe(this.unitSearchAuthority$);
  }

	ngOnDestroy() {
		this.a3a5FormGroup.disable();
		this.subscription?.unsubscribe();
	}

	resetInput(): void {
		this.a3a5FormGroup.reset({
			from: '',
			to: '',
			canton: '',
			userIds: []
		});
	}
}
