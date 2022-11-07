import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {FormControl, ValidatorFn} from "@angular/forms";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {ReportType} from 'shared/model';
import {MatChipInputEvent, MatChipList} from "@angular/material/chips";
import {Subscription} from "rxjs";
import {ReportService} from "../../../report.service";

@Component({
	selector: 'ec-chip-list-fieldset',
	templateUrl: './chip-list-fieldset.component.html',
	styleUrls: ['./chip-list-fieldset.component.scss']
})
export class ChipListFieldsetComponent implements OnInit, OnDestroy {

	@Input()
	chipDataFormControl: FormControl

	@Input()
	formatValidator: ValidatorFn

	@ViewChild('chipList')
	chipList: MatChipList;

	ReportType = ReportType;
	separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

	// Used for currently entered data for a chip to be added.
	formControl = new FormControl('', {updateOn: 'submit'});
	errorUvcis: string[] = [];

	subscription: Subscription;

	constructor(private readonly reportService: ReportService,
				private readonly cd: ChangeDetectorRef) {
	}

	ngOnInit(): void {
		this.subscription = this.reportService.reset$.subscribe(() => this.resetInput())
		this.subscription.add(

			// Workaround to validate that chiplist is not empty
			this.reportService.validateChiplist$.subscribe(_ => {
				this.chipList.focus()
				this.chipDataFormControl.markAsTouched()
				this.chipDataFormControl.markAsDirty()
				this.formControl.markAsTouched()
				this.formControl.markAsDirty()
				this.updateErrorState()
			})
		)

		// Trigger new change detection run because updateErrorState() changes formGroup validity
		// which is used in a component higher in the tree resulting in ExpressionChangedAfterItHasBeenCheckedError.
		setTimeout(() => this.updateErrorState());
	}

	ngOnDestroy() {
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
				this.chipDataFormControl.setValue([...this.chipDataFormControl.value, uvciToAdd]);
				if (this.formatValidator(this.formControl)) {
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

		this.chipDataFormControl.setValue([...this.chipDataFormControl.value, uvciToAdd]);

		if (input) {
			input.value = '';
		}

		if (this.formatValidator(this.formControl)) {
			this.errorUvcis.push(uvciToAdd);
		}

		this.updateErrorState();
	}

	remove(uvciToRemove: string): void {
		const errorIndex = this.errorUvcis.indexOf(uvciToRemove);
		if (errorIndex >= 0) {
			this.errorUvcis.splice(errorIndex, 1);
		}

		const toRemoveIndex = this.chipDataFormControl.value.indexOf(uvciToRemove);

		if (toRemoveIndex >= 0) {
			const newUvcis = [...this.chipDataFormControl.value]
			newUvcis.splice(toRemoveIndex, 1)
			this.chipDataFormControl.setValue(newUvcis);
		}
		this.formControl.markAsTouched();
		this.updateErrorState();
	}

	resetInput(): void {
		this.formControl.setValue(null);
		this.errorUvcis = [];
		this.chipDataFormControl.reset([]);
		this.updateErrorState();
	}

	private updateErrorState(): void {
		let errors = null;

		if (!this.errorUvcis.length) {
			if (this.chipDataFormControl.value.length > 100) {
				errors = {tooManyUvcis: true};
				this.chipList.errorState = true;
			} else {
				if (this.chipDataFormControl.value.length < 1) {
					errors = {required: true};
				}
			}
		} else {
			errors = {format: true};
		}
		this.formControl.setErrors(errors, {
			emitEvent: true
		});
		this.chipDataFormControl.setErrors(this.formControl.errors, {
			emitEvent: true
		})
		this.chipList.errorState = this.formControl.invalid && this.formControl.touched;
	}
}
