import {Component, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {MatChipInputEvent, MatChipList} from "@angular/material/chips";
import {FormControl, Validators} from "@angular/forms";
import {uvciValidator} from "../../../create/utils/uvci-validator";
import {ReportService} from "../../report.service";
import {ReportType} from "shared/model";

export interface A2Parameter {
	uvcis: string[]
}

@Component({
	selector: 'ec-report-a2',
	templateUrl: './report-a2.component.html',
	styleUrls: ['./report-a2.component.scss']
})
export class ReportA2Component implements OnInit {
	@ViewChild('chipList') chipList: MatChipList

	ReportType = ReportType
	separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
	formControl = new FormControl('', [uvciValidator, Validators.required])
	errorUvcis: string[] = []
	tooManyUvcis = false

	constructor(public readonly reportService: ReportService) {
	}

	ngOnInit(): void {
        if (!this.reportService.parameter[ReportType.A2]) {
			this.reportService.parameter[ReportType.A2] = {
				uvcis: []
			}
		}
	}

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const uvciToAdd = event.value.trim();
		this.formControl.setValue(uvciToAdd)

		this.reportService.parameter[ReportType.A2].uvcis.push(uvciToAdd);

		if (input) {
			input.value = '';
		}

		if (this.formControl.invalid) {
			this.errorUvcis.push(uvciToAdd);
			this.chipList.errorState = true;
		} else {
			if (!this.errorUvcis.length) {
				if (this.reportService.parameter[ReportType.A2].uvcis.length > 100) {
					this.tooManyUvcis = true
					this.chipList.errorState = true;
				} else {
					this.tooManyUvcis = false
					this.chipList.errorState = false;
				}
			}
		}
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

		if (this.reportService.parameter[ReportType.A2].uvcis.length > 100) {
			this.tooManyUvcis = true
			this.chipList.errorState = true;
		} else {
			this.tooManyUvcis = false
			this.chipList.errorState = this.errorUvcis.length > 0;
		}
	}

	resetInput(): void {
		this.formControl.setValue(null)
		this.errorUvcis = []
		this.reportService.parameter[ReportType.A2].uvcis = []
		this.chipList.errorState = false
		this.tooManyUvcis = false
	}
}
