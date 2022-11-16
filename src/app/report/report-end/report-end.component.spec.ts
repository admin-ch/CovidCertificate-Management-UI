import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportEndComponent} from './report-end.component';
import {SharedModule} from 'shared/shared.module';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';
import {TranslateModule} from '@ngx-translate/core';

describe('ReportEndComponent', () => {
	let component: ReportEndComponent;
	let fixture: ComponentFixture<ReportEndComponent>;

	const stepperMock = {
		next: jest.fn()
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SharedModule, TranslateModule.forRoot()],
			declarations: [ReportEndComponent],
			providers: [
				{
					provide: MatStepper,
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
