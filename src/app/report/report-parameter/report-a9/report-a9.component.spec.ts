import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportA9Component} from './report-a9.component';
import {ReportType} from "shared/model";
import {ObliqueTestingModule} from "@oblique/oblique";
import {TranslateModule} from "@ngx-translate/core";
import {FormArray, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ReportService} from "../../report.service";
import {Subject} from "rxjs";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";

describe('ReportA9Component', () => {
	let component: ReportA9Component;
	let fixture: ComponentFixture<ReportA9Component>;
	let reportService: ReportService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, TranslateModule, FormsModule, ReactiveFormsModule],
			declarations: [ReportA9Component],
			providers: [
				{
					provide: ReportService,
					useValue: {
						formGroup: new FormGroup({}),
						reset$: new Subject()
					}
				},
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportA9Component);
		component = fixture.componentInstance;
		reportService = TestBed.inject(ReportService);
		reportService.formGroup = new FormGroup({
			[ReportType.A9]: new FormGroup({
				types: new FormArray([]),
			})
		});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
