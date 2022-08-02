import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatChipList} from '@angular/material/chips';
import {FormControl, FormGroup} from '@angular/forms';
import {uvciValidator} from '../../../create/utils/uvci-validator';
import {ReportService} from '../../report.service';
import {ReportType} from 'shared/model';
import {Subscription} from "rxjs";

@Component({
	selector: 'ec-report-a2',
	templateUrl: './report-a2.component.html',
	styleUrls: ['./report-a2.component.scss']
})
export class ReportA2Component implements OnInit, OnDestroy {
	@ViewChild('chipList') chipList: MatChipList;

	a2FormGroup: FormGroup;

	ReportType = ReportType;
	separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
	formControl = new FormControl('', {updateOn: 'submit'});
	errorUvcis: string[] = [];

	subscription: Subscription;

	constructor(public readonly reportService: ReportService) {
	}


	ngOnInit(): void {
		this.a2FormGroup = this.reportService.formGroup.get(ReportType.A2) as FormGroup
		this.a2FormGroup.enable()
		this.subscription = this.reportService.reset$.subscribe(() => this.resetInput())

		// Trigger new change detection run because updateErrorState() changes formGroup validity
		// which is used in a component higher in the tree resulting in ExpressionChangedAfterItHasBeenCheckedError.
		setTimeout(() => this.updateErrorState());
	}

	ngOnDestroy() {
		this.a2FormGroup.disable()
		this.subscription?.unsubscribe()
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
				this.a2FormGroup.get('uvcis').setValue([...this.a2FormGroup.get('uvcis').value, uvciToAdd]);
				if (uvciValidator(this.formControl)) {
					this.errorUvcis.push(uvciToAdd);
				}
			});
		this.formControl.markAsTouched();
		this.formControl.setValue(null);
		this.updateErrorState();
	}

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const uvciToAdd = event.value.trim();
		this.formControl.setValue(uvciToAdd);
		this.formControl.markAsTouched();

		this.a2FormGroup.get('uvcis').setValue([...this.a2FormGroup.get('uvcis').value, uvciToAdd]);

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

		const toRemoveIndex = this.a2FormGroup.get('uvcis').value.indexOf(uvciToRemove);

		if (toRemoveIndex >= 0) {
			const newUvcis = [...this.a2FormGroup.get('uvcis').value]
			newUvcis.splice(toRemoveIndex, 1)
			this.a2FormGroup.get('uvcis').setValue(newUvcis);
		}
		this.formControl.markAsTouched();
		this.updateErrorState();
	}

	resetInput(): void {
		this.formControl.setValue(null);
		this.errorUvcis = [];
		this.a2FormGroup.reset({
			uvcis: []
		});
		this.updateErrorState();
	}

	private updateErrorState(): void {
		let errors = null;

		if (!this.errorUvcis.length) {
			if (this.a2FormGroup.get('uvcis').value.length > 100) {
				errors = {tooManyUvcis: true};
				this.chipList.errorState = true;
			} else {
				if (this.a2FormGroup.get('uvcis').value.length < 1) {
					errors = {required: true};
				}
			}
		} else {
			errors = {format: true};
		}
		this.formControl.setErrors(errors, {
			emitEvent: true
		});
		this.a2FormGroup.setErrors(this.formControl.errors, {
			emitEvent: true
		})
		this.chipList.errorState = this.formControl.invalid && this.formControl.touched;
	}
}
