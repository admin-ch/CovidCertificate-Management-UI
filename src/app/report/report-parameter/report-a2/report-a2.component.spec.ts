import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportA2Component} from './report-a2.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule} from '@oblique/oblique';
import {ReportService} from '../../report.service';
import {ReportType} from 'shared/model';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject} from "rxjs";

describe('ReportA2Component', () => {
	let component: ReportA2Component;
	let fixture: ComponentFixture<ReportA2Component>;
	let reportService: ReportService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule],
			declarations: [ReportA2Component],
			providers: [
				{
					provide: ReportService,
					useValue: {
						formGroup: new FormGroup({}),
						reset$: new Subject()
					}
				}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportA2Component);
		component = fixture.componentInstance;
		reportService = TestBed.inject(ReportService);
		reportService.formGroup = new FormGroup({
			[ReportType.A2]: new FormGroup({
				uvcis: new FormControl([])
			})
		});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should register the formControl', () => {
		expect(component.uvcisFormControl).toBeTruthy();
	});
});
