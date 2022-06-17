import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CertificateType, ReportA7Component} from './report-a7.component';
import {MatChipInputEvent} from '@angular/material/chips';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule} from '@oblique/oblique';
import {ReportService} from '../../report.service';
import {DataRoomCode, ReportType} from 'shared/model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../../../auth/auth.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import * as moment from "moment";

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
						formGroup: new FormGroup({})
					}
				},
				{
					provide: AuthService,
					useValue: {
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
				dataRoom: new FormControl('', Validators.required),
				types: new FormControl([]),
			})
		});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('certTypeCheckboxChanged', () => {
		it('should should add passed certificate to the formGroup if checked is true', () => {
			component.a7FormGroup.get('types').setValue([CertificateType.A, CertificateType.RR])
			component.certTypeCheckboxChanged(true, CertificateType.ME)

			expect(component.a7FormGroup.get('types').value).toEqual([CertificateType.A, CertificateType.RR, CertificateType.ME])
		});
		it('should should remove passed certificate from the formGroup if checked is false', () => {
			component.a7FormGroup.get('types').setValue([CertificateType.A, CertificateType.RR])
			component.certTypeCheckboxChanged(false, CertificateType.RR)

			expect(component.a7FormGroup.get('types').value).toEqual([CertificateType.A])
		});
	});

	describe('checkAllCertTypes', () => {
		it('should should add all certificate types to the formGroup if checked is true', () => {
			component.a7FormGroup.get('types').setValue([])
			component.checkAllCertTypes(true)

			expect(component.a7FormGroup.get('types').value).toEqual(Object.values(CertificateType))
		});
		it('should should remove all certificate types from the formGroup if checked is false', () => {
			component.a7FormGroup.get('types').setValue(Object.values(CertificateType))
			component.checkAllCertTypes(false)

			expect(component.a7FormGroup.get('types').value).toEqual([])
		});
	});

	describe('resetInput', () => {
		it('should clear all inputs', () => {
			component.a7FormGroup.get('from').setValue(moment('2022-01-01'))
			component.a7FormGroup.get('to').setValue(moment('2022-01-01'))
			component.a7FormGroup.get('dataRoom').setValue(DataRoomCode.AG)
			component.a7FormGroup.get('types').setValue(Object.values(CertificateType))

			component.resetInput()

			expect(component.a7FormGroup.get('from').value).toEqual('')
			expect(component.a7FormGroup.get('to').value).toEqual('')
			expect(component.a7FormGroup.get('dataRoom').value).toEqual('')
			expect(component.a7FormGroup.get('types').value).toEqual([])
		});
	});
});
