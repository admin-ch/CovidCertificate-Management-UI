import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule} from '@oblique/oblique';
import {SharedModule} from "shared/shared.module";
import {ReportGenerationComponent} from "./report-generation.component";
import {MatHorizontalStepper} from "@angular/material/stepper";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ReportGenerationComponent', () => {
	let component: ReportGenerationComponent;
	let fixture: ComponentFixture<ReportGenerationComponent>;

	const stepperMock = {
		next: jest.fn()
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, SharedModule, HttpClientTestingModule],
			providers: [
				{
					provide: MatHorizontalStepper,
					useValue: stepperMock
				},
				{provide: 'REPORT_HOST', useValue: 'REPORT_HOST'},

			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
			declarations: [ReportGenerationComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportGenerationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges()
	});

	it('should create', () => {
		expect(component).toBeTruthy()
	});
});
