import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportA11Component} from './report-a11.component';
import {ObliqueTestingModule} from '@oblique/oblique';
import {SharedModule} from 'shared/shared.module';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReportService} from '../../report.service';
import {ReportType} from 'shared/model';
import {Subject} from 'rxjs';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import * as moment from 'moment';

describe('ReportA11Component', () => {
	let component: ReportA11Component;
	let fixture: ComponentFixture<ReportA11Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, SharedModule, FormsModule, ReactiveFormsModule, MatFormFieldModule],
			providers: [
				{
					provide: ReportService,
					useValue: {
						formGroup: new FormGroup({
							[ReportType.A11]: new FormGroup({
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
			declarations: [ReportA11Component]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportA11Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('resetInput', () => {
		it('should clear all inputs', () => {
			component.a11FormGroup.get('from').setValue(moment('2022-01-01'));
			component.a11FormGroup.get('to').setValue(moment('2022-01-01'));

			component.resetInput();

			expect(component.a11FormGroup.get('from').value).toEqual('');
			expect(component.a11FormGroup.get('to').value).toEqual('');
		});
	});
});
