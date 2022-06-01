import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatChipList} from '@angular/material/chips';
import {FormControl, FormGroup} from '@angular/forms';
import {uvciValidator} from '../../../create/utils/uvci-validator';
import {ReportService} from '../../report.service';
import {ReportType} from 'shared/model';

export interface A2Parameter {
	uvcis: string[];
}

@Component({
	selector: 'ec-report-a2',
	templateUrl: './report-a2.component.html',
	styleUrls: ['./report-a2.component.scss']
})
export class ReportA2Component implements OnInit {
	@Input()
	reportFormGroup: FormGroup;

	@ViewChild('chipList') chipList: MatChipList;

	ReportType = ReportType;
	separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
	formControl = new FormControl('', {updateOn: 'submit'});
	errorUvcis: string[] = [];

	constructor(public readonly reportService: ReportService) {}

	ngOnInit(): void {
		(this.reportFormGroup.get(ReportType.A2) as FormGroup).addControl('uvcis', this.formControl);
		if (!this.reportService.parameter[ReportType.A2]) {
			this.reportService.parameter[ReportType.A2] = {
				uvcis: []
			};
		}

		// TODO: How to handle this correctly? This is because this component is wrapped in an *ngIf (resp. *ngSwitchCase)
		// Trigger new change detection run because updateErrorState() changes formGroup validity
		// which is used in a component higher in the tree resulting in ExpressionChangedAfterItHasBeenCheckedError.
		setTimeout(() => this.updateErrorState());
	}

	onPaste(event: ClipboardEvent): void {
		event.preventDefault(); //Prevents the default action
		event.clipboardData
			.getData('Text')
			// Accepts:
			// xxx,xxx,xxx
			// xxx, xxx, xxx
			// xxx xxx xxx
			// xxx\nxxx\nxxx
			.split(/, |,| |\n/)
			.forEach(uvciToAdd => {
				uvciToAdd = uvciToAdd.trim();
				this.formControl.setValue(uvciToAdd);
				this.reportService.parameter[ReportType.A2].uvcis.push(uvciToAdd);
				if (uvciValidator(this.formControl)) {
					this.errorUvcis.push(uvciToAdd);
				}
			});
		this.formControl.setValue(null);
		this.updateErrorState();
	}

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const uvciToAdd = event.value.trim();
		this.formControl.setValue(uvciToAdd);
		this.formControl.markAsTouched();

		this.reportService.parameter[ReportType.A2].uvcis.push(uvciToAdd);

		if (input) {
			input.value = '';
		}

		if (uvciValidator(this.formControl)) {
			this.errorUvcis.push(uvciToAdd);
		}

		this.updateErrorState();
	}

	remove(uvciToRemove: string): void {
		const errorIndex = this.errorUvcis.indexOf(uvciToRemove);
		if (errorIndex >= 0) {
			this.errorUvcis.splice(errorIndex, 1);
		}

		const toRemoveIndex = this.reportService.parameter[ReportType.A2].uvcis.indexOf(uvciToRemove);

		if (toRemoveIndex >= 0) {
			this.reportService.parameter[ReportType.A2].uvcis.splice(toRemoveIndex, 1);
		}
		this.updateErrorState();
	}

	resetInput(): void {
		this.formControl.setValue(null);
		this.errorUvcis = [];
		this.reportService.parameter[ReportType.A2].uvcis = [];
		this.updateErrorState();
	}

	private updateErrorState(): void {
		let errors = null;

		if (!this.errorUvcis.length) {
			if (this.reportService.parameter[ReportType.A2].uvcis.length > 100) {
				errors = {tooManyUvcis: true};
				this.chipList.errorState = true;
			} else {
				if (this.reportService.parameter[ReportType.A2].uvcis.length < 1) {
					errors = {required: true};
				}
			}
		} else {
			errors = {format: true};
		}
		this.formControl.setErrors(errors, {
			emitEvent: true
		});
		this.chipList.errorState = this.formControl.invalid && this.formControl.touched;
	}
}
