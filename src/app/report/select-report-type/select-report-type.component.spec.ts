import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Directive, Input, NO_ERRORS_SCHEMA} from '@angular/core';
import {SelectReportTypeComponent} from './select-report-type.component';
import {AuthFunction, AuthService} from '../../auth/auth.service';
import {Subject} from 'rxjs';
import {ReportType} from 'shared/model';
import {ReportService} from '../report.service';
import {MatRadioModule} from '@angular/material/radio';
import {CommonModule} from '@angular/common';
import {MatStepper} from '@angular/material/stepper';
import {TranslateModule} from '@ngx-translate/core';

@Directive({
	selector: '[ecHasAuthorizationFor],[ecHasAuthorizationForAny]'
})
export class MockDirective {
	@Input('ecHasAuthorizationFor')
	functionName: AuthFunction;

	@Input('ecHasAuthorizationForAny')
	functionNames: AuthFunction[] = [];
}

describe('SelectReportTypeComponent', () => {
	let component: SelectReportTypeComponent;
	let fixture: ComponentFixture<SelectReportTypeComponent>;
	let reportService: ReportService;

	const stepperMock = {
		next: jest.fn()
	};

	const authServiceMock = {
		authorizedFunctions$: new Subject()
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CommonModule, MatRadioModule, TranslateModule.forRoot()],
			providers: [
				{
					provide: MatStepper,
					useValue: stepperMock
				},
				{
					provide: AuthService,
					useValue: authServiceMock
				},
				{
					provide: ReportService,
					useValue: {
						selectedReportType: null
					}
				}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
			declarations: [SelectReportTypeComponent, MockDirective]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SelectReportTypeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		reportService = TestBed.inject(ReportService);
	});

	describe('goNext()', () => {
		beforeEach(() => {
			stepperMock.next.mockReset();
		});

		it('should not do anything if type is invalid', () => {
			component.formControl.setValue(null);
			reportService.selectedReportType = ReportType.A4;
			component.goNext();
			expect(stepperMock.next).not.toHaveBeenCalled();
			expect(reportService.selectedReportType).toBe(ReportType.A4);
		});

		it('should set report type to the selected one', () => {
			component.formControl.setValue(ReportType.A5);
			reportService.selectedReportType = ReportType.A4;

			component.goNext();
			expect(reportService.selectedReportType).toBe(ReportType.A5);
		});

		it('should call stepper.next()', () => {
			component.formControl.setValue(ReportType.A5);
			reportService.selectedReportType = ReportType.A4;
			component.goNext();
			expect(stepperMock.next).toHaveBeenCalled();
		});
	});
});
