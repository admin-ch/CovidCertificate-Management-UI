import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportA3A5Component } from './report-a3-a5.component';
import {ObliqueTestingModule} from "@oblique/oblique";
import {SharedModule} from "shared/shared.module";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReportService} from "../../report.service";
import {ReportType} from "shared/model";
import {Subject} from "rxjs";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import * as moment from "moment";

describe('ReportA3A5Component', () => {
	let component: ReportA3A5Component;
	let fixture: ComponentFixture<ReportA3A5Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, SharedModule, FormsModule, ReactiveFormsModule, MatFormFieldModule],
			providers: [
				{
					provide: ReportService,
					useValue: {
						formGroup: new FormGroup({
							[ReportType.A3]: new FormGroup({
								from: new FormControl(''),
								to: new FormControl(''),
								canton: new FormControl('buv')
							})
						}),
						reset$: new Subject()
					}
				}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
			declarations: [ReportA3A5Component]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportA3A5Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('resetInput', () => {
		it('should clear all inputs', () => {
			component.a3a5FormGroup.get('from').setValue(moment('2022-01-01'));
			component.a3a5FormGroup.get('to').setValue(moment('2022-01-01'));

			component.resetInput();

			expect(component.a3a5FormGroup.get('from').value).toEqual('');
			expect(component.a3a5FormGroup.get('to').value).toEqual('');
		});
	});
});
