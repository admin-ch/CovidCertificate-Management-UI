import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportEndComponent} from './report-end.component';
import {ObliqueTestingModule} from '@oblique/oblique';
import {SharedModule} from 'shared/shared.module';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {MatHorizontalStepper} from '@angular/material/stepper';

describe('ReportEndComponent', () => {
	let component: ReportEndComponent;
	let fixture: ComponentFixture<ReportEndComponent>;

	const stepperMock = {
		next: jest.fn()
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, SharedModule],
			declarations: [ReportEndComponent],
			providers: [
				{
					provide: MatHorizontalStepper,
					useValue: stepperMock
				}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportEndComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
