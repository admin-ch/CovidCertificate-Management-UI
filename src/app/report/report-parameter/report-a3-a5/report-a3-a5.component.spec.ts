import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

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
import {SelectedProfilesService} from "../_shared/selected-profiles.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatRadioModule} from "@angular/material/radio";

describe('ReportA3A5Component', () => {
	let component: ReportA3A5Component;
	let fixture: ComponentFixture<ReportA3A5Component>;
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
				{
					provide: ReportService,
					useValue: {
						formGroup: new FormGroup({
							[ReportType.A3]: new FormGroup({
								from: new FormControl(''),
								to: new FormControl(''),
								canton: new FormControl('buv'),
								userIds: new FormControl([]),
							})
						}),
						reset$: new Subject()
					}
				},
				{provide: SelectedProfilesService, useValue: new SelectedProfilesService()}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
			declarations: [ReportA3A5Component]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportA3A5Component);
		component = fixture.componentInstance;
		selectedProfilesService = TestBed.inject(SelectedProfilesService);
		fixture.detectChanges();
	});


	it('should create', () => {
		expect(component).toBeTruthy();
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

	describe('resetInput', () => {
		it('should clear all inputs', () => {
			component.a3a5FormGroup.get('from').setValue(moment('2022-01-01'));
			component.a3a5FormGroup.get('to').setValue(moment('2022-01-01'));
			component.a3a5FormGroup.get('canton').setValue('buv');
			component.a3a5FormGroup.get('userIds').setValue(['1', '2', '3']);
			component.resetInput();

			expect(component.a3a5FormGroup.get('from').value).toEqual('');
			expect(component.a3a5FormGroup.get('to').value).toEqual('');
			expect(component.a3a5FormGroup.get('canton').value).toEqual('');
			expect(component.a3a5FormGroup.get('userIds').value).toEqual([]);
		});
	});
});
