import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportA13Component} from './report-a13.component';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from 'shared/shared.module';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReportService} from '../../report.service';
import {ReportType} from 'shared/model';
import {Subject} from 'rxjs';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import * as moment from 'moment/moment';

describe('ReportA13Component', () => {
	let component: ReportA13Component;
	let fixture: ComponentFixture<ReportA13Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot(), SharedModule, FormsModule, ReactiveFormsModule, MatFormFieldModule],
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
			declarations: [ReportA13Component]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportA13Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('resetInput', () => {
		it('should clear all inputs', () => {
			component.a13FormGroup.get('from').setValue(moment('2022-01-01'));
			component.a13FormGroup.get('to').setValue(moment('2022-01-01'));

			component.resetInput();

			expect(component.a13FormGroup.get('from').value).toEqual('');
			expect(component.a13FormGroup.get('to').value).toEqual('');
		});
	});
});
