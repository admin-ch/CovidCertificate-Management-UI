import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportA12Component} from './report-a12.component';
import {ReportService} from "../../report.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Subject} from "rxjs";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {ObliqueTestingModule} from "@oblique/oblique";
import {ReportType} from "shared/model";

describe('ReportA12Component', () => {
	let component: ReportA12Component;
	let fixture: ComponentFixture<ReportA12Component>;
	let reportService: ReportService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule],
			declarations: [ReportA12Component],
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
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportA12Component);
		component = fixture.componentInstance;
		reportService = TestBed.inject(ReportService);
		reportService.formGroup = new FormGroup({
			[ReportType.A12]: new FormGroup({
				transferCodes: new FormControl([])
			})
		});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
