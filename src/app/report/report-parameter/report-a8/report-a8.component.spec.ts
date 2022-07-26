import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportA8Component} from './report-a8.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule} from '@oblique/oblique';
import {ReportService} from '../../report.service';
import {DataRoomCode, ReportType} from 'shared/model';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from "../../../auth/auth.service";
import {TranslateModule} from "@ngx-translate/core";
import * as moment from "moment";
import {Subject} from "rxjs";

describe('ReportA8Component', () => {
	let component: ReportA8Component;
	let fixture: ComponentFixture<ReportA8Component>;
	let reportService: ReportService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, TranslateModule, FormsModule, ReactiveFormsModule],
			declarations: [ReportA8Component],
			providers: [
				{
					provide: ReportService,
					useValue: {
						formGroup: new FormGroup({}),
						reset$: new Subject()
					}
				},
				{
					provide: AuthService,
					useValue: {
						authorizedDataRooms$: new Subject<DataRoomCode[]>()
					}
				},
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportA8Component);
		component = fixture.componentInstance;
		reportService = TestBed.inject(ReportService);
		reportService.formGroup = new FormGroup({
			[ReportType.A8]: new FormGroup({
				from: new FormControl('', Validators.required),
				to: new FormControl('', Validators.required),
				canton: new FormControl('', Validators.required),
				types: new FormArray([]),
			})
		});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('resetInput', () => {
		it('should clear all inputs', () => {
			component.a8FormGroup.get('from').setValue(moment('2022-01-01'))
			component.a8FormGroup.get('to').setValue(moment('2022-01-01'))

			component.resetInput()

			expect(component.a8FormGroup.get('from').value).toEqual('')
			expect(component.a8FormGroup.get('to').value).toEqual('')
		});
	});
});
