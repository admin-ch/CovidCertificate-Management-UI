import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {ReportService} from "../../report.service";
import {ReportType} from "shared/model";

@Component({
  selector: 'ec-report-a3-a5',
  templateUrl: './report-a3-a5.component.html',
  styleUrls: ['./report-a3-a5.component.scss']
})
export class ReportA3A5Component implements OnInit, OnDestroy {
	@ViewChild('ngForm') ngForm: NgForm;

	a3a5FormGroup: FormGroup;
	dateFromFormControl: FormControl;
	dateToFormControl: FormControl;
	cantonFormControl: FormControl;

	subscription: Subscription;

  constructor(public readonly reportService: ReportService) { }

  ngOnInit(): void {
	  this.a3a5FormGroup = this.reportService.formGroup.get(ReportType.A3) as FormGroup;
	  this.dateFromFormControl = this.a3a5FormGroup.get('from') as FormControl;
	  this.dateToFormControl = this.a3a5FormGroup.get('to') as FormControl;
	  this.cantonFormControl = this.a3a5FormGroup.get('canton') as FormControl;
	  this.a3a5FormGroup.enable();
	  setTimeout(() => this.ngForm.resetForm(this.a3a5FormGroup.value));
  }

	ngOnDestroy() {
		this.a3a5FormGroup.disable();
		this.subscription?.unsubscribe();
	}

	resetInput(): void {
		this.a3a5FormGroup.reset({
			from: '',
			to: '',
			canton: ''
		});
	}
}
