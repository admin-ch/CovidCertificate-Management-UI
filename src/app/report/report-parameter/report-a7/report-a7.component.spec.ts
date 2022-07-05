import {ComponentFixture, fakeAsync, TestBed, tick, waitForAsync} from '@angular/core/testing';

import {CertificateType, ReportA7Component} from './report-a7.component';
import {MatChipInputEvent} from '@angular/material/chips';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule} from '@oblique/oblique';
import {ReportService} from '../../report.service';
import {DataRoomCode, ReportType} from 'shared/model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../../../auth/auth.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import * as moment from "moment";
import {Subject} from "rxjs";

describe('ReportA7Component', () => {
	let component: ReportA7Component;
	let fixture: ComponentFixture<ReportA7Component>;
	let reportService: ReportService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, TranslateModule],
			declarations: [ReportA7Component],
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
		fixture = TestBed.createComponent(ReportA7Component);
		component = fixture.componentInstance;
		reportService = TestBed.inject(ReportService);
		reportService.formGroup = new FormGroup({
			[ReportType.A7]: new FormGroup({
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
			component.a7FormGroup.get('from').setValue(moment('2022-01-01'))
			component.a7FormGroup.get('to').setValue(moment('2022-01-01'))
			component.a7FormGroup.get('canton').setValue(DataRoomCode.AG)
			Object.values(CertificateType).forEach((type, index) => {
				(component.a7FormGroup.get('types') as FormArray).insert(index, new FormControl(type));
			})

			component.resetInput()

			expect(component.a7FormGroup.get('from').value).toEqual('')
			expect(component.a7FormGroup.get('to').value).toEqual('')
			expect(component.a7FormGroup.get('canton').value).toEqual('')
			expect(component.a7FormGroup.get('types').value).toEqual([])
		});
	});
});
