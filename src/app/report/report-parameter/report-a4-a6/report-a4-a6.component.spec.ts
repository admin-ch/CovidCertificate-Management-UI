import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ReportA4A6Component} from './report-a4-a6.component';
import {ObliqueTestingModule} from '@oblique/oblique';
import {SharedModule} from 'shared/shared.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import * as moment from 'moment';
import {DataRoomCode, ReportType} from 'shared/model';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReportService} from '../../report.service';
import {Subject} from 'rxjs';
import {MatRadioModule} from '@angular/material/radio';
import {SelectedProfilesService} from './selected-profiles.service';

describe('ReportA4A6Component', () => {
	let component: ReportA4A6Component;
	let fixture: ComponentFixture<ReportA4A6Component>;
	let selectedProfilesService: SelectedProfilesService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ObliqueTestingModule,
				SharedModule,
				HttpClientTestingModule,
				FormsModule,
				ReactiveFormsModule,
				MatFormFieldModule,
				MatRadioModule
			],
			providers: [
				{provide: 'REPORT_HOST', useValue: 'REPORT_HOST'},
				{
					provide: ReportService,
					useValue: {
						formGroup: new FormGroup({
							[ReportType.A4]: new FormGroup({
								from: new FormControl(''),
								to: new FormControl(''),
								canton: new FormControl('buv'),
								types: new FormArray([]),
								userIds: new FormArray([])
							})
						}),
						reset$: new Subject()
					}
				},
				{provide: SelectedProfilesService, useValue: new SelectedProfilesService()}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
			declarations: [ReportA4A6Component]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportA4A6Component);
		component = fixture.componentInstance;

		selectedProfilesService = TestBed.inject(SelectedProfilesService);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('resetInput', () => {
		it('should clear all inputs', () => {
			component.a4a6FormGroup.get('from').setValue(moment('2022-01-01'));
			component.a4a6FormGroup.get('to').setValue(moment('2022-01-01'));
			component.a4a6FormGroup.get('canton').setValue(DataRoomCode.AG);

			component.resetInput();

			expect(component.a4a6FormGroup.get('from').value).toEqual('');
			expect(component.a4a6FormGroup.get('to').value).toEqual('');
			expect(component.a4a6FormGroup.get('canton').value).toEqual('');
		});
	});

	describe('cantonFormControl.valueChanges observer', () => {
		let clear: jest.SpyInstance;

		beforeEach(() => {
			clear = jest.spyOn(selectedProfilesService, 'clear');
		});

		it('should call selectedProfilesService.clear() when the canton value changes', fakeAsync(() => {
			component.cantonFormControl.setValue('be');
			tick();
			expect(clear).toHaveBeenCalled();
		}));

		it('should not call selectedProfilesService.clear() when the canton value does not change (emitting same value as last)', fakeAsync(() => {
			component.cantonFormControl.setValue('buv');
			tick();
			clear.mockClear();
			component.cantonFormControl.setValue('buv');
			tick();

			expect(clear).not.toHaveBeenCalled();
		}));
	});
});
