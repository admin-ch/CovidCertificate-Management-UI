import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Directive, Input, NO_ERRORS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule} from '@oblique/oblique';
import {SelectReportTypeComponent} from "./select-report-type.component";
import {AuthFunction, AuthService} from "../../auth/auth.service";
import {Subject} from "rxjs";
import {ReportType} from "shared/model";
import {ReportService} from "../report.service";
import {MatRadioModule} from "@angular/material/radio";
import {CommonModule} from "@angular/common";
import {MatHorizontalStepper} from "@angular/material/stepper";

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

	const authServiceMock = {
		authorizedFunctions$: new Subject()
	}

	const reportServiceMock = {
		selectedReportType: null
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, CommonModule, MatRadioModule],
			providers: [
				{
					provide: MatHorizontalStepper,
					useValue: MatHorizontalStepper
				},
				{
					provide: AuthService,
					useValue: authServiceMock
				},
				{
					provide: ReportService,
					useValue: reportServiceMock
				}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
			declarations: [SelectReportTypeComponent, MockDirective]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SelectReportTypeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges()
		reportServiceMock.selectedReportType = null
	});

	describe('initializing form', () => {
		describe('type of formGroup', () => {
			it.each([
				[[AuthFunction.REPORT_A2], ReportType.A2],
				[[AuthFunction.REPORT_A2, AuthFunction.REPORT_A3], ReportType.A3],
				[[AuthFunction.REPORT_A10, AuthFunction.REPORT_A2], ReportType.A7],
				[[AuthFunction.REPORT_A12, AuthFunction.REPORT_A3], ReportType.A3],
				[[AuthFunction.REPORT_A12, AuthFunction.REPORT_A4, AuthFunction.REPORT_A8], ReportType.A4],
			])
			('should be set correctly according to authorization', fakeAsync((ownedAuthFunctions, expectedReportType) => {
				authServiceMock.authorizedFunctions$.next(ownedAuthFunctions)
				tick()
				expect(component.formControl.value).toBe(expectedReportType)
			}));
		})

		describe('formGroup', () => {
			it('should be invalid if no type is selected', fakeAsync(() => {
				tick()
				component.formControl.setValue(null)
				expect(component.formControl.invalid).toBe(true)
			}));
		})

		describe('formGroup', () => {
			it('should be invalid if no type is selected', fakeAsync(() => {
				tick()
				component.formControl.setValue(null)
				expect(component.formControl.invalid).toBe(true)
			}));
		});
	});

	describe('goNext()', () => {
		it('should not do anything if type is invalid', waitForAsync(() => {
			component.formControl.setValue(null)
			reportServiceMock.selectedReportType = ReportType.A4
			component.next.subscribe(() => {
				fail('next should not have been called')
			})
			component.goNext()
			expect(reportServiceMock.selectedReportType).toBe(ReportType.A4)
		}));
	});
});
