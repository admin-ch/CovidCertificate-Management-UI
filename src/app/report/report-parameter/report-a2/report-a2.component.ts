import {Component, ViewChild} from '@angular/core';
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {MatChipInputEvent, MatChipList} from "@angular/material/chips";
import {FormControl, Validators} from "@angular/forms";
import {uvciValidator} from "../../../create/utils/uvci-validator";
import {ReportService} from "../../report.service";

@Component({
	selector: 'ec-report-a2',
	templateUrl: './report-a2.component.html',
	styleUrls: ['./report-a2.component.scss']
})
export class ReportA2Component {

	@ViewChild('chipList') chipList: MatChipList

	selectedUvcis: string[] = []
	separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

	formControl = new FormControl('', [uvciValidator, Validators.required])
	errorUvcis: string[] = []

	constructor(private readonly reportService: ReportService) {
	}

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const uvciToAdd = event.value.trim();
		this.formControl.setValue(uvciToAdd)

		this.selectedUvcis.push(uvciToAdd);

		if (input) {
			input.value = '';
		}

		if (this.formControl.invalid) {
			this.errorUvcis.push(uvciToAdd);
			this.chipList.errorState = true;
		} else {
			if (!this.errorUvcis.length) {
				this.chipList.errorState = false;
			}
		}
	}

	remove(uvciToRemove: string): void {
		const errorIndex = this.errorUvcis.indexOf(uvciToRemove);
		if (errorIndex >= 0) {
			this.errorUvcis.splice(errorIndex, 1);
		}

		const toRemoveIndex = this.selectedUvcis.indexOf(uvciToRemove);

		if (toRemoveIndex >= 0) {
			this.selectedUvcis.splice(toRemoveIndex, 1);
		}

		this.chipList.errorState = this.errorUvcis.length > 0;
	}

	resetInput(): void {
		this.formControl.setValue(null)
		this.errorUvcis = []
		this.selectedUvcis = []
		this.chipList.errorState = false
	}
}
